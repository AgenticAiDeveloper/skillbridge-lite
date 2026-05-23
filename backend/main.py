from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import ping_database
from routes import services

app = FastAPI(
    title="SkillBridge Lite API",
    description="FastAPI backend for SkillBridge Lite marketplace",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
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
    database_status = "connected"

    try:
        await ping_database()
    except Exception:
        database_status = "unavailable"

    return {
        "success": True,
        "status": "healthy",
        "database": database_status,
        "auth": "Firebase",
        "storage": "Cloudinary"
    }


@app.get("/health")
async def health_alias():
    return await health_check()


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )
