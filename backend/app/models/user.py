from datetime import datetime, timezone
from bson import ObjectId

def user_helper(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "isVerified": user.get("isVerified", True),
        "role": user.get("role", "owner"),
        "createdAt": user.get("createdAt", datetime.now(timezone.utc))
    }
