from fastapi import APIRouter, HTTPException, status, Depends, Query
from bson import ObjectId
from app.database import get_database
from app.services.auth_service import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/spaces", tags=["Embed"])

@router.get("/{id}/embed")
async def get_space_embed_code(
    id: str,
    layout: str = Query("grid", description="grid | carousel | badge"),
    theme: str = Query("light", description="light | dark"),
    current_user: dict = Depends(get_current_user)
):
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
        
    slug = space["slug"]
    embed_url = f"{settings.FRONTEND_URL}/embed/{slug}?layout={layout}&theme={theme}"
    iframe_snippet = f'<iframe src="{embed_url}" width="100%" height="600" frameborder="0" scrolling="no" style="border:none; border-radius:12px; overflow:hidden;"></iframe>'
    
    return {
        "spaceId": str(space["_id"]),
        "slug": slug,
        "businessName": space["businessName"],
        "layout": layout,
        "theme": theme,
        "embedUrl": embed_url,
        "iframeSnippet": iframe_snippet
    }
