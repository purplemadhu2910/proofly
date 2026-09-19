from datetime import datetime, timezone

def testimonial_helper(testimonial: dict) -> dict:
    return {
        "id": str(testimonial["_id"]),
        "spaceId": str(testimonial["spaceId"]),
        "customerName": testimonial["customerName"],
        "customerEmail": testimonial["customerEmail"],
        "companyRole": testimonial.get("companyRole", "Customer"),
        "rating": testimonial["rating"],
        "reviewText": testimonial["reviewText"],
        "avatar": testimonial.get("avatar"),
        "status": testimonial.get("status", "pending"),  # pending | approved | archived
        "isFeatured": testimonial.get("isFeatured", False),
        "isLiked": testimonial.get("isLiked", False),
        "createdAt": testimonial.get("createdAt", datetime.now(timezone.utc)),
        "updatedAt": testimonial.get("updatedAt", datetime.now(timezone.utc))
    }
