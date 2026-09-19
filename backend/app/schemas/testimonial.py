from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class TestimonialCreate(BaseModel):
    customerName: str = Field(..., min_length=2, max_length=100)
    customerEmail: EmailStr
    companyRole: Optional[str] = Field(default="Customer", max_length=100)
    rating: int = Field(..., ge=1, le=5)
    reviewText: str = Field(..., min_length=5, max_length=2000)
    avatar: Optional[str] = None

class TestimonialUpdate(BaseModel):
    status: Optional[str] = Field(default=None, description="pending | approved | archived")
    isFeatured: Optional[bool] = None
    isLiked: Optional[bool] = None

class TestimonialResponse(BaseModel):
    id: str
    spaceId: str
    customerName: str
    customerEmail: str
    companyRole: Optional[str] = None
    rating: int
    reviewText: str
    avatar: Optional[str] = None
    status: str
    isFeatured: bool
    isLiked: bool
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None

class TestimonialListResponse(BaseModel):
    testimonials: List[TestimonialResponse]
    total: int
    page: int
    limit: int
