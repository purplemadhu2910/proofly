import asyncio
from app.database import connect_to_mongo, get_database, close_mongo_connection

async def wipe_all_data():
    print("Initializing MongoDB connection to clear all data...")
    await connect_to_mongo()
    db = get_database()
    
    if db is not None:
        u_res = await db.users.delete_many({})
        s_res = await db.spaces.delete_many({})
        t_res = await db.testimonials.delete_many({})
        print(f"[OK] Cleared {u_res.deleted_count} users.")
        print(f"[OK] Cleared {s_res.deleted_count} spaces.")
        print(f"[OK] Cleared {t_res.deleted_count} testimonials.")
        print("\nDatabase is now completely empty and clean.")
        
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(wipe_all_data())
