from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SpaceCreate(BaseModel):
    businessName: str = Field(..., min_length=2, max_length=100)
    slug: Optional[str] = None
    logo: Optional[str] = None
    description: Optional[str] = None
    customPrompt: Optional[str] = "How has our product/service helped you achieve your goals?"
    showAvatar: bool = True
    showRating: bool = True
    customQuestions: List[str] = []

class SpaceUpdate(BaseModel):
    businessName: Optional[str] = None
    slug: Optional[str] = None
    logo: Optional[str] = None
    description: Optional[str] = None
    customPrompt: Optional[str] = None
    showAvatar: Optional[bool] = None
    showRating: Optional[bool] = None
    customQuestions: Optional[List[str]] = None

class SpaceResponse(BaseModel):
    id: str
    ownerId: str
    businessName: str
    slug: str
    logo: Optional[str] = None
    description: Optional[str] = None
    customPrompt: str
    showAvatar: bool
    showRating: bool
    customQuestions: List[str]
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None
    publicCollectionUrl: Optional[str] = None
