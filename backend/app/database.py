import logging
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logger = logging.getLogger("proofly.database")

class Database:
    client: AsyncIOMotorClient = None
    db = None
    is_mock: bool = False

db_instance = Database()

async def connect_to_mongo():
    logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
    try:
        # Try real Motor client with short server selection timeout
        real_client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
        # Verify connection
        await real_client.admin.command('ping')
        db_instance.client = real_client
        db_instance.db = real_client[settings.DB_NAME]
        db_instance.is_mock = False
        logger.info(f"Successfully connected to MongoDB ({settings.DB_NAME})")
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB server at {settings.MONGODB_URI}: {e}")
        logger.warning("Switching to in-memory mongomock_motor database fallback...")
        try:
            from mongomock_motor import AsyncMongoMockClient
            mock_client = AsyncMongoMockClient()
            db_instance.client = mock_client
            db_instance.db = mock_client[settings.DB_NAME]
            db_instance.is_mock = True
            logger.info("Successfully initialized mongomock_motor database")
        except Exception as mock_err:
            logger.error(f"Failed to initialize mock database: {mock_err}")
            raise mock_err

    # Ensure indexes
    await setup_indexes()

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("Closed MongoDB connection")

async def setup_indexes():
    if db_instance.db is None:
        return
    try:
        # User collection indexes
        await db_instance.db.users.create_index("email", unique=True)
        
        # Space collection indexes
        await db_instance.db.spaces.create_index("slug", unique=True)
        await db_instance.db.spaces.create_index("ownerId")
        
        # Testimonial collection indexes
        await db_instance.db.testimonials.create_index("spaceId")
        await db_instance.db.testimonials.create_index("status")
        await db_instance.db.testimonials.create_index("isFeatured")
        await db_instance.db.testimonials.create_index([
            ("customerName", "text"),
            ("customerEmail", "text"),
            ("reviewText", "text")
        ])
        logger.info("MongoDB collection indexes initialized successfully")
    except Exception as e:
        logger.warning(f"Index creation notice: {e}")

def get_database():
    return db_instance.db
