import asyncio
from datetime import datetime, timedelta, timezone
from app.database import connect_to_mongo, get_database, close_mongo_connection
from app.utils.security import hash_password

async def auto_seed_if_empty(db):
    """Auto seeds demo owner, spaces, and testimonials if the database is empty"""
    existing_user = await db.users.find_one({"email": "demo@proofly.io"})
    if existing_user:
        return

    print("Auto-seeding demo data into active MongoDB database...")
    now = datetime.now(timezone.utc)
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

    spaces_data = [
        {
            "ownerId": owner_id,
            "businessName": "Instagram",
            "slug": "instagram",
            "logo": "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=150&auto=format&fit=crop&q=80",
            "description": "The world's largest visual social platform for creators and brands.",
            "customPrompt": "How has Instagram helped you grow your personal brand or business revenue?",
            "showAvatar": True,
            "showRating": True,
            "customQuestions": ["What feature do you use most?", "How much reach did you gain?"],
            "createdAt": now - timedelta(days=30),
            "updatedAt": now
        },
        {
            "ownerId": owner_id,
            "businessName": "Acme Corp",
            "slug": "acme-corp",
            "logo": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&auto=format&fit=crop&q=80",
            "description": "Enterprise cloud workflow & security solutions.",
            "customPrompt": "What impact has Acme Corp had on your team's workflow productivity?",
            "showAvatar": True,
            "showRating": True,
            "customQuestions": ["How many hours per week do you save?"],
            "createdAt": now - timedelta(days=20),
            "updatedAt": now
        },
        {
            "ownerId": owner_id,
            "businessName": "SaaSify",
            "slug": "saasify",
            "logo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80",
            "description": "No-code analytics & subscription billing engine.",
            "customPrompt": "Share your thoughts on SaaSify's billing automation.",
            "showAvatar": True,
            "showRating": True,
            "customQuestions": [],
            "createdAt": now - timedelta(days=10),
            "updatedAt": now
        }
    ]

    inserted_spaces = []
    for s_data in spaces_data:
        res = await db.spaces.insert_one(s_data)
        s_data["_id"] = res.inserted_id
        inserted_spaces.append(s_data)

    ig_id = str(inserted_spaces[0]["_id"])
    acme_id = str(inserted_spaces[1]["_id"])
    saas_id = str(inserted_spaces[2]["_id"])

    testimonials_data = [
        {
            "spaceId": ig_id,
            "customerName": "Alex Morgan",
            "customerEmail": "alex.m@creatorstudio.io",
            "companyRole": "Growth Content Creator",
            "rating": 5,
            "reviewText": "Instagram Stories and Reels completely transformed our customer engagement! Our reach grew by 350% in under 90 days. Proofly allowed us to collect social proof effortlessly.",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": True,
            "isLiked": True,
            "createdAt": now - timedelta(days=15),
            "updatedAt": now - timedelta(days=15)
        },
        {
            "spaceId": ig_id,
            "customerName": "David Chen",
            "customerEmail": "david@techhorizon.com",
            "companyRole": "Marketing Director @ TechHorizon",
            "rating": 5,
            "reviewText": "The seamless integration with our digital marketing stack made running influencer campaigns 10x faster. Highly recommended to all e-commerce brands.",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": True,
            "isLiked": True,
            "createdAt": now - timedelta(days=12),
            "updatedAt": now - timedelta(days=12)
        },
        {
            "spaceId": ig_id,
            "customerName": "Elena Rostova",
            "customerEmail": "elena@fashionvibe.co",
            "companyRole": "Founder, FashionVibe",
            "rating": 5,
            "reviewText": "We generated over $45,000 in revenue directly from Instagram Shopping tags this month alone. It is an absolute gamechanger for independent fashion labels!",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": False,
            "isLiked": True,
            "createdAt": now - timedelta(days=8),
            "updatedAt": now - timedelta(days=8)
        },
        {
            "spaceId": ig_id,
            "customerName": "Marcus Vance",
            "customerEmail": "marcus@vancemedia.net",
            "companyRole": "Digital Strategist",
            "rating": 4,
            "reviewText": "Great platform overall for visual storytelling. Wish analytics had a bit more export granular options, but overall user adoption is stellar.",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
            "status": "pending",
            "isFeatured": False,
            "isLiked": False,
            "createdAt": now - timedelta(days=2),
            "updatedAt": now - timedelta(days=2)
        },
        {
            "spaceId": ig_id,
            "customerName": "Sophia Taylor",
            "customerEmail": "sophia@designcraft.org",
            "companyRole": "UI/UX Lead",
            "rating": 5,
            "reviewText": "Super crisp user experience and modern visual presentation. Customer responses have been overwhelmingly positive!",
            "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": False,
            "isLiked": False,
            "createdAt": now - timedelta(hours=18),
            "updatedAt": now - timedelta(hours=18)
        },
        {
            "spaceId": ig_id,
            "customerName": "Robert Blake",
            "customerEmail": "rblake@spam-domain.com",
            "companyRole": "Bot Tester",
            "rating": 1,
            "reviewText": "Irrelevant feedback test entry for moderation testing.",
            "avatar": "",
            "status": "archived",
            "isFeatured": False,
            "isLiked": False,
            "createdAt": now - timedelta(days=20),
            "updatedAt": now - timedelta(days=20)
        },
        {
            "spaceId": acme_id,
            "customerName": "Jennifer Sterling",
            "customerEmail": "jsterling@cloudmatrix.com",
            "companyRole": "VP of Engineering @ CloudMatrix",
            "rating": 5,
            "reviewText": "Acme Corp's security automation suite slashed our compliance audit preparation time from 3 weeks down to 2 days. Incredible support and rock-solid uptime.",
            "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": True,
            "isLiked": True,
            "createdAt": now - timedelta(days=14),
            "updatedAt": now - timedelta(days=14)
        },
        {
            "spaceId": acme_id,
            "customerName": "Kevin Wright",
            "customerEmail": "kwright@apexglobal.com",
            "companyRole": "DevOps Architect",
            "rating": 4,
            "reviewText": "Very reliable infrastructure. Seamless API integrations and clean documentation made onboard effortless for our backend team.",
            "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": False,
            "isLiked": False,
            "createdAt": now - timedelta(days=9),
            "updatedAt": now - timedelta(days=9)
        },
        {
            "spaceId": saas_id,
            "customerName": "Samantha Reed",
            "customerEmail": "sreed@fintechflow.com",
            "companyRole": "Head of Finance @ FintechFlow",
            "rating": 5,
            "reviewText": "SaaSify's automated dunning and subscription management reduced our monthly churn by 18%. It paid for itself in the first 48 hours!",
            "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
            "status": "approved",
            "isFeatured": True,
            "isLiked": True,
            "createdAt": now - timedelta(days=7),
            "updatedAt": now - timedelta(days=7)
        }
    ]

    await db.testimonials.insert_many(testimonials_data)
    print("Auto-seeding complete.")

async def run_seed():
    print("Initializing MongoDB connection for seeding...")
    await connect_to_mongo()
    db = get_database()
    
    print("Clearing existing seed data...")
    await db.users.delete_many({"email": "demo@proofly.io"})
    await db.spaces.delete_many({})
    await db.testimonials.delete_many({})
    
    await auto_seed_if_empty(db)
    
    print("\n--- SEED COMPLETE ---")
    print("Demo Credentials:")
    print("  Email: demo@proofly.io")
    print("  Password: password123")
    print("  Collection URL: http://localhost:5173/collect/instagram")
    print("  Wall of Love:   http://localhost:5173/wall/instagram")
    
    await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(run_seed())
