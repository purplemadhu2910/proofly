from fastapi import APIRouter, HTTPException, status, Request, UploadFile, File
from typing import List, Optional
from datetime import datetime, timezone
import os
import shutil
import uuid
from app.database import get_database
from app.schemas.space import SpaceResponse
from app.schemas.testimonial import TestimonialCreate, TestimonialResponse
from app.models.space import space_helper
from app.models.testimonial import testimonial_helper
from app.utils.helpers import check_rate_limit, slugify
from app.config import settings

router = APIRouter(prefix="/api/public", tags=["Public"])

@router.get("/spaces/{slug}", response_model=SpaceResponse)
async def get_public_space_by_slug(slug: str):
    db = get_database()
    space = await db.spaces.find_one({"slug": slug.lower()})
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found.")
    
    helper_res = space_helper(space)
    helper_res["publicCollectionUrl"] = f"{settings.FRONTEND_URL}/collect/{space['slug']}"
    return SpaceResponse(**helper_res)

@router.post("/spaces/{slug}/testimonials", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def submit_public_testimonial(
    slug: str,
    testimonial_in: TestimonialCreate,
    request: Request
):
    # Check rate limit (10 requests per minute per IP)
    client_ip = request.client.host if request.client else "127.0.0.1"
    if not check_rate_limit(client_ip, max_requests=10, window_seconds=60):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please wait a minute before submitting another review."
        )
        
    db = get_database()
    space = await db.spaces.find_one({"slug": slug.lower()})
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found.")
        
    space_id_str = str(space["_id"])
    now = datetime.now(timezone.utc)
    
    testimonial_doc = {
        "spaceId": space_id_str,
        "customerName": testimonial_in.customerName,
        "customerEmail": testimonial_in.customerEmail.lower(),
        "companyRole": testimonial_in.companyRole or "Customer",
        "rating": testimonial_in.rating,
        "reviewText": testimonial_in.reviewText,
        "avatar": testimonial_in.avatar or "",
        "status": "pending",  # Requires owner moderation approval
        "isFeatured": False,
        "isLiked": False,
        "createdAt": now,
        "updatedAt": now
    }
    
    result = await db.testimonials.insert_one(testimonial_doc)
    testimonial_doc["_id"] = result.inserted_id
    
    return TestimonialResponse(**testimonial_helper(testimonial_doc))

@router.get("/spaces/{slug}/testimonials", response_model=List[TestimonialResponse])
async def get_public_wall_testimonials(
    slug: str,
    featured_only: Optional[bool] = False
):
    """Returns ONLY approved testimonials for public Wall of Love display"""
    db = get_database()
    space = await db.spaces.find_one({"slug": slug.lower()})
    if not space:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Space not found.")
        
    space_id_str = str(space["_id"])
    
    query = {
        "spaceId": space_id_str,
        "status": "approved"
    }
    if featured_only:
        query["isFeatured"] = True
        
    cursor = db.testimonials.find(query).sort([("isFeatured", -1), ("createdAt", -1)])
    testimonials = []
    async for doc in cursor:
        testimonials.append(TestimonialResponse(**testimonial_helper(doc)))
        
    return testimonials

@router.post("/upload")
async def upload_public_image(file: UploadFile = File(...)):
    """Upload logo or customer avatar image"""
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format. Allowed formats: {', '.join(allowed_extensions)}"
        )
        
    filename = f"{uuid.uuid4().hex}{ext}"
    upload_dir = os.path.join(os.getcwd(), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    
    filepath = os.path.join(upload_dir, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    file_url = f"{settings.BASE_URL}/uploads/{filename}"
    return {"url": file_url, "filename": filename}
