from pydantic import BaseModel
from typing import Dict

class AnalyticsResponse(BaseModel):
    spaceId: str
    businessName: str
    totalTestimonials: int
    pendingTestimonials: int
    approvedTestimonials: int
    featuredTestimonials: int
    averageRating: float
    ratingBreakdown: Dict[int, int]  # e.g., {5: 10, 4: 3, 3: 1, 2: 0, 1: 0}
