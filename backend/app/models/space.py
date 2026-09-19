from datetime import datetime, timezone

def space_helper(space: dict) -> dict:
    return {
        "id": str(space["_id"]),
        "ownerId": str(space["ownerId"]),
        "businessName": space["businessName"],
        "slug": space["slug"],
        "logo": space.get("logo"),
        "description": space.get("description"),
        "customPrompt": space.get("customPrompt", "How has our product/service helped you achieve your goals?"),
        "showAvatar": space.get("showAvatar", True),
        "showRating": space.get("showRating", True),
        "customQuestions": space.get("customQuestions", []),
        "createdAt": space.get("createdAt", datetime.now(timezone.utc)),
        "updatedAt": space.get("updatedAt", datetime.now(timezone.utc))
    }
