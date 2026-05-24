from motor.motor_asyncio import AsyncIOMotorClient

from config import settings

if not settings.MONGO_URI:
    raise RuntimeError("MONGO_URI is not configured. Add it to backend/.env.")

client = AsyncIOMotorClient(
    settings.MONGO_URI,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
    socketTimeoutMS=5000,
)
db = client[settings.DATABASE_NAME]

services_collection = db["services"]
orders_collection = db["orders"]


async def ping_database():
    await client.admin.command("ping")


async def check_database_connection():
    try:
        await ping_database()
        return True
    except Exception:
        return False


async def ensure_indexes():
    await services_collection.create_index("created_at")
    await services_collection.create_index("owner_uid")
    await services_collection.create_index("category")


def close_database():
    client.close()
