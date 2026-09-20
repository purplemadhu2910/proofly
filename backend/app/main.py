import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import connect_to_mongo, get_database, close_mongo_connection
from app.routes import auth, spaces, testimonials, public, analytics, embed
from seed import auto_seed_if_empty

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to Mongo
    await connect_to_mongo()
    db = get_database()
    if db is not None:
        try:
            await auto_seed_if_empty(db)
        except Exception as seed_err:
            print(f"Auto-seed notice: {seed_err}")
    yield
    # Shutdown: Close connection
    await close_mongo_connection()

app = FastAPI(
    title="Proofly API — Testimonial & Social Proof Collector",
    version="1.0.0",
    description="Full-stack Python assessment project backend powered by FastAPI & MongoDB.",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static uploads (for avatars & logos)
upload_dir = os.path.join(os.getcwd(), "uploads")
os.makedirs(upload_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")

# Include Modular Routers
app.include_router(auth.router)
app.include_router(spaces.router)
app.include_router(testimonials.router)
app.include_router(public.router)
app.include_router(analytics.router)
app.include_router(embed.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": "Proofly Backend API",
        "version": "1.0.0",
        "environment": settings.ENV
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
