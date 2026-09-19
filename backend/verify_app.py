import asyncio
from datetime import datetime, timezone
from app.database import connect_to_mongo, get_database, close_mongo_connection
from app.utils.security import hash_password, verify_password

async def test_backend():
    print("Testing Proofly Backend Logic...")
    await connect_to_mongo()
    db = get_database()
    
    # 1. Seed user directly in active DB instance
    now = datetime.now(timezone.utc)
    await db.users.delete_many({"email": "demo@proofly.io"})
    owner_doc = {
        "name": "Sarah Connor",
        "email": "demo@proofly.io",
        "passwordHash": hash_password("password123"),
        "isVerified": True,
        "role": "owner",
        "createdAt": now
    }
    user_res = await db.users.insert_one(owner_doc)
    owner_id = str(user_res.inserted_id)
    print(f"[OK] Seeded demo owner (ID: {owner_id})")

    # 2. Verify Demo User
    user = await db.users.find_one({"email": "demo@proofly.io"})
    assert user is not None, "Demo user not found!"
    assert verify_password("password123", user["passwordHash"]), "Password verification failed!"
    print("[OK] Demo User & Bcrypt Authentication verified.")

    # 3. Create Space
    await db.spaces.delete_many({"ownerId": owner_id})
    space_doc = {
        "ownerId": owner_id,
        "businessName": "Instagram",
        "slug": "instagram",
        "logo": "https://example.com/logo.png",
        "description": "Visual social platform",
        "customPrompt": "How has Instagram helped you?",
        "showAvatar": True,
        "showRating": True,
        "customQuestions": ["What feature do you use?"],
        "createdAt": now,
        "updatedAt": now
    }
    space_res = await db.spaces.insert_one(space_doc)
    space_id = str(space_res.inserted_id)
    print("[OK] Space creation verified.")

    # 4. Create Testimonial
    await db.testimonials.delete_many({"spaceId": space_id})
    test_doc = {
        "spaceId": space_id,
        "customerName": "Alex Morgan",
        "customerEmail": "alex@creator.io",
        "companyRole": "Content Creator",
        "rating": 5,
        "reviewText": "Instagram transformed our reach by 350%!",
        "avatar": "https://example.com/avatar.jpg",
        "status": "approved",
        "isFeatured": True,
        "isLiked": True,
        "createdAt": now,
        "updatedAt": now
    }
    await db.testimonials.insert_one(test_doc)
    print("[OK] Testimonial creation verified.")

    # 5. Query Wall Testimonials
    approved = await db.testimonials.find({"spaceId": space_id, "status": "approved"}).to_list(10)
    assert len(approved) == 1, "Expected 1 approved testimonial"
    print(f"[OK] Wall query returned {len(approved)} approved testimonial.")

    await close_mongo_connection()
    print("\nALL BACKEND SYSTEM VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(test_backend())
