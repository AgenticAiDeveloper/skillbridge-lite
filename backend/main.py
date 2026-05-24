from fastapi import Depends, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import check_database_connection
from firebase_auth import get_current_user
from routes import services

app = FastAPI(
    title="SkillBridge Lite API",
    description="FastAPI backend for SkillBridge Lite marketplace",
    version="1.0.0"
)

allowed_origins = settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(services.router)


@app.get("/")
async def root():
    return {
        "success": True,
        "message": "SkillBridge Lite FastAPI backend is running"
    }


@app.get("/api/health")
async def health_check():
    db_ok = await check_database_connection()

    return {
        "success": True,
        "status": "healthy",
        "database_connected": db_ok,
        "auth": "Firebase",
        "storage": "Cloudinary"
    }


@app.get("/api/auth/me")
async def auth_me(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "user": current_user,
    }


@app.get("/health")
async def health_alias():
    return await health_check()


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT)
