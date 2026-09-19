from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from typing import List
from datetime import datetime, timezone
from bson import ObjectId
import os
import shutil
from app.database import get_database
from app.schemas.space import SpaceCreate, SpaceUpdate, SpaceResponse
from app.models.space import space_helper
from app.services.auth_service import get_current_user
from app.utils.helpers import slugify
from app.config import settings

router = APIRouter(prefix="/api/spaces", tags=["Spaces"])

@router.post("", response_model=SpaceResponse, status_code=status.HTTP_201_CREATED)
async def create_space(space_in: SpaceCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    # Generate slug if not supplied or clean supplied slug
    base_slug = slugify(space_in.slug if space_in.slug else space_in.businessName)
    slug = base_slug
    
    # Ensure slug is unique
    counter = 1
    while await db.spaces.find_one({"slug": slug}):
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    now = datetime.now(timezone.utc)
    space_doc = {
        "ownerId": owner_id,
        "businessName": space_in.businessName,
        "slug": slug,
        "logo": space_in.logo or "",
        "description": space_in.description or "",
        "customPrompt": space_in.customPrompt or "How has our product/service helped you achieve your goals?",
        "showAvatar": space_in.showAvatar,
        "showRating": space_in.showRating,
        "customQuestions": space_in.customQuestions or [],
        "createdAt": now,
        "updatedAt": now
    }
    
    result = await db.spaces.insert_one(space_doc)
    space_doc["_id"] = result.inserted_id
    
    helper_res = space_helper(space_doc)
    helper_res["publicCollectionUrl"] = f"{settings.FRONTEND_URL}/collect/{slug}"
    return SpaceResponse(**helper_res)

@router.get("", response_model=List[SpaceResponse])
async def list_spaces(current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    cursor = db.spaces.find({"ownerId": owner_id}).sort("createdAt", -1)
    spaces = []
    async for doc in cursor:
        helper_res = space_helper(doc)
        helper_res["publicCollectionUrl"] = f"{settings.FRONTEND_URL}/collect/{doc['slug']}"
        spaces.append(SpaceResponse(**helper_res))
    return spaces

@router.get("/{id}", response_model=SpaceResponse)
async def get_space(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    query = {"ownerId": owner_id}
    try:
        query["_id"] = ObjectId(id)
    except Exception:
        query["_id"] = id
        
    space = await db.spaces.find_one(query)
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found or unauthorized.")
        
    helper_res = space_helper(space)
    helper_res["publicCollectionUrl"] = f"{settings.FRONTEND_URL}/collect/{space['slug']}"
    return SpaceResponse(**helper_res)

@router.put("/{id}", response_model=SpaceResponse)
async def update_space(id: str, space_in: SpaceUpdate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    query = {"ownerId": owner_id}
    try:
        query["_id"] = ObjectId(id)
    except Exception:
        query["_id"] = id
        
    existing_space = await db.spaces.find_one(query)
    if not existing_space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found or unauthorized.")
        
    update_data = {k: v for k, v in space_in.model_dump().items() if v is not None}
    
    if "slug" in update_data and update_data["slug"] != existing_space["slug"]:
        new_slug = slugify(update_data["slug"])
        existing_slug = await db.spaces.find_one({"slug": new_slug})
        if existing_slug and str(existing_slug["_id"]) != str(existing_space["_id"]):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug is already in use by another space.")
        update_data["slug"] = new_slug
        
    update_data["updatedAt"] = datetime.now(timezone.utc)
    
    await db.spaces.update_one(query, {"$set": update_data})
    updated_space = await db.spaces.find_one(query)
    
    helper_res = space_helper(updated_space)
    helper_res["publicCollectionUrl"] = f"{settings.FRONTEND_URL}/collect/{updated_space['slug']}"
    return SpaceResponse(**helper_res)

@router.delete("/{id}")
async def delete_space(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    query = {"ownerId": owner_id}
    try:
        query["_id"] = ObjectId(id)
    except Exception:
        query["_id"] = id
        
    existing_space = await db.spaces.find_one(query)
    if not existing_space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found or unauthorized.")
        
    space_id_str = str(existing_space["_id"])
    
    # Delete space and its testimonials
    await db.spaces.delete_one(query)
    await db.testimonials.delete_many({"spaceId": space_id_str})
    
    return {"message": "Space and associated testimonials deleted successfully."}
