from fastapi import APIRouter, HTTPException, status, Depends, Query, Response
from typing import Optional, List
from datetime import datetime, timezone
from bson import ObjectId
import re
import csv
import io
from app.database import get_database
from app.schemas.testimonial import (
    TestimonialUpdate, TestimonialResponse, TestimonialListResponse
)
from app.models.testimonial import testimonial_helper
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/testimonials", tags=["Testimonials"])

@router.get("/export")
async def export_testimonials_csv(
    spaceId: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Exports testimonials as a downloadable CSV file for enterprise reporting"""
    db = get_database()
    owner_id = current_user["id"]
    
    user_spaces = await db.spaces.find({"ownerId": owner_id}).to_list(100)
    user_space_ids = [str(s["_id"]) for s in user_spaces]
    
    query = {}
    if spaceId:
        if spaceId not in user_space_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized space access.")
        query["spaceId"] = spaceId
    else:
        query["spaceId"] = {"$in": user_space_ids}
        
    testimonials = await db.testimonials.find(query).sort("createdAt", -1).to_list(1000)
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Customer Name", "Customer Email", "Company & Role",
        "Rating", "Review Text", "Status", "Is Featured", "Submitted At"
    ])
    
    for t in testimonials:
        writer.writerow([
            str(t["_id"]),
            t.get("customerName", ""),
            t.get("customerEmail", ""),
            t.get("companyRole", ""),
            t.get("rating", 5),
            t.get("reviewText", "").replace("\n", " "),
            t.get("status", "pending"),
            t.get("isFeatured", False),
            t.get("createdAt", "")
        ])
        
    response = Response(content=output.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = f"attachment; filename=proofly_testimonials_export_{datetime.now().strftime('%Y%m%d')}.csv"
    return response

@router.get("", response_model=TestimonialListResponse)
async def list_testimonials(
    spaceId: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    rating_filter: Optional[int] = Query(None, alias="rating"),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    owner_id = current_user["id"]
    
    user_spaces = await db.spaces.find({"ownerId": owner_id}).to_list(100)
    user_space_ids = [str(s["_id"]) for s in user_spaces]
    
    if not user_space_ids:
        return TestimonialListResponse(testimonials=[], total=0, page=page, limit=limit)
        
    query = {}
    if spaceId:
        if spaceId not in user_space_ids:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized access to space.")
        query["spaceId"] = spaceId
    else:
        query["spaceId"] = {"$in": user_space_ids}
        
    if status_filter and status_filter.lower() != "all":
        query["status"] = status_filter.lower()
        
    if rating_filter and rating_filter > 0:
        query["rating"] = rating_filter
        
    if search:
        search_regex = re.compile(re.escape(search), re.IGNORECASE)
        query["$or"] = [
            {"customerName": search_regex},
            {"customerEmail": search_regex},
            {"reviewText": search_regex},
            {"companyRole": search_regex}
        ]
        
    total = await db.testimonials.count_documents(query)
    skip = (page - 1) * limit
    
    cursor = db.testimonials.find(query).sort("createdAt", -1).skip(skip).limit(limit)
    testimonials = []
    async for doc in cursor:
        testimonials.append(TestimonialResponse(**testimonial_helper(doc)))
        
    return TestimonialListResponse(
        testimonials=testimonials,
        total=total,
        page=page,
        limit=limit
    )

@router.get("/{id}", response_model=TestimonialResponse)
async def get_testimonial(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    query = {}
    try:
        query["_id"] = ObjectId(id)
    except Exception:
        query["_id"] = id
        
    doc = await db.testimonials.find_one(query)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
        
    try:
        space_query = {"_id": ObjectId(doc["spaceId"])}
    except Exception:
        space_query = {"_id": doc["spaceId"]}
    space = await db.spaces.find_one(space_query)
    if not space or str(space["ownerId"]) != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized access.")
        
    return TestimonialResponse(**testimonial_helper(doc))

@router.patch("/{id}", response_model=TestimonialResponse)
async def update_testimonial(
    id: str,
    update_in: TestimonialUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_database()
    owner_id = current_user["id"]
    
    query = {}
    try:
        query["_id"] = ObjectId(id)
    except Exception:
        query["_id"] = id
        
    doc = await db.testimonials.find_one(query)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
        
    try:
        space_query = {"_id": ObjectId(doc["spaceId"])}
    except Exception:
        space_query = {"_id": doc["spaceId"]}
    space = await db.spaces.find_one(space_query)
    if not space or str(space["ownerId"]) != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized action.")
        
    update_data = {k: v for k, v in update_in.model_dump().items() if v is not None}
    update_data["updatedAt"] = datetime.now(timezone.utc)
    
    await db.testimonials.update_one(query, {"$set": update_data})
    updated_doc = await db.testimonials.find_one(query)
    return TestimonialResponse(**testimonial_helper(updated_doc))

@router.delete("/{id}")
async def delete_testimonial(id: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    owner_id = current_user["id"]
    
    query = {}
    try:
        query["_id"] = ObjectId(id)
    except Exception:
        query["_id"] = id
        
    doc = await db.testimonials.find_one(query)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
        
    try:
        space_query = {"_id": ObjectId(doc["spaceId"])}
    except Exception:
        space_query = {"_id": doc["spaceId"]}
    space = await db.spaces.find_one(space_query)
    if not space or str(space["ownerId"]) != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized action.")
        
    await db.testimonials.delete_one(query)
    return {"message": "Testimonial deleted successfully."}
