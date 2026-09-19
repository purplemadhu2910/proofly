from fastapi import APIRouter, HTTPException, status, Depends
from bson import ObjectId
from app.database import get_database
from app.schemas.analytics import AnalyticsResponse
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api/spaces", tags=["Analytics"])

@router.get("/{id}/analytics", response_model=AnalyticsResponse)
async def get_space_analytics(id: str, current_user: dict = Depends(get_current_user)):
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
        
    space_id_str = str(space["_id"])
    
    # Aggregate testimonial stats
    testimonials = await db.testimonials.find({"spaceId": space_id_str}).to_list(1000)
    
    total = len(testimonials)
    pending = sum(1 for t in testimonials if t.get("status") == "pending")
    approved = sum(1 for t in testimonials if t.get("status") == "approved")
    featured = sum(1 for t in testimonials if t.get("isFeatured") is True)
    
    rating_breakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    total_rating_sum = 0
    
    for t in testimonials:
        r = t.get("rating", 5)
        if r in rating_breakdown:
            rating_breakdown[r] += 1
        total_rating_sum += r
        
    avg_rating = round(total_rating_sum / total, 1) if total > 0 else 0.0
    
    return AnalyticsResponse(
        spaceId=space_id_str,
        businessName=space["businessName"],
        totalTestimonials=total,
        pendingTestimonials=pending,
        approvedTestimonials=approved,
        featuredTestimonials=featured,
        averageRating=avg_rating,
        ratingBreakdown=rating_breakdown
    )
