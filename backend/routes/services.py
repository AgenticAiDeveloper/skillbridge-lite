from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from bson import ObjectId
from datetime import datetime, timezone
from typing import Optional
from pymongo.errors import PyMongoError

from database import services_collection
from firebase_auth import get_current_user
from cloudinary_config import upload_image_to_cloudinary

router = APIRouter(prefix="/api/services", tags=["Services"])


def service_serializer(service):
    return {
        "id": str(service["_id"]),
        "title": service.get("title"),
        "description": service.get("description"),
        "category": service.get("category"),
        "price": service.get("price"),
        "delivery_time": service.get("delivery_time"),
        "image_url": service.get("image_url"),
        "owner_uid": service.get("owner_uid"),
        "owner_email": service.get("owner_email"),
        "created_at": service.get("created_at"),
    }


def database_unavailable(error: PyMongoError):
    raise HTTPException(
        status_code=503,
        detail="Database is unavailable. Check MongoDB Atlas connection and IP access."
    ) from error


def validate_service_input(title: str, description: str, price: float, delivery_time: int):
    if len(title.strip()) < 3:
        raise HTTPException(status_code=400, detail="Title must be at least 3 characters.")

    if len(description.strip()) < 10:
        raise HTTPException(status_code=400, detail="Description must be at least 10 characters.")

    if price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0.")

    if delivery_time <= 0:
        raise HTTPException(status_code=400, detail="Delivery time must be greater than 0.")


@router.get("/")
async def get_services(search: Optional[str] = None, category: Optional[str] = None):
    query = {}

    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
        ]

    if category and category.lower() != "all":
        query["category"] = {"$regex": category, "$options": "i"}

    try:
        services = []
        cursor = services_collection.find(query).sort("created_at", -1)

        async for service in cursor:
            services.append(service_serializer(service))
    except PyMongoError as error:
        database_unavailable(error)

    return {
        "success": True,
        "count": len(services),
        "services": services
    }


@router.get("/{service_id}")
async def get_single_service(service_id: str):
    if not ObjectId.is_valid(service_id):
        raise HTTPException(status_code=400, detail="Invalid service ID")

    try:
        service = await services_collection.find_one({"_id": ObjectId(service_id)})
    except PyMongoError as error:
        database_unavailable(error)

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return {
        "success": True,
        "service": service_serializer(service)
    }


@router.post("/")
async def create_service(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    price: float = Form(...),
    delivery_time: int = Form(...),
    image: UploadFile = File(None),
    current_user: dict = Depends(get_current_user)
):
    validate_service_input(title, description, price, delivery_time)

    image_url = None

    if image:
        image_url = await upload_image_to_cloudinary(image)

    new_service = {
        "title": title,
        "description": description,
        "category": category,
        "price": price,
        "delivery_time": delivery_time,
        "image_url": image_url,
        "owner_uid": current_user["uid"],
        "owner_email": current_user.get("email"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }

    try:
        result = await services_collection.insert_one(new_service)

        created_service = await services_collection.find_one({"_id": result.inserted_id})
    except PyMongoError as error:
        database_unavailable(error)

    return {
        "success": True,
        "message": "Service created successfully",
        "service": service_serializer(created_service)
    }


@router.delete("/{service_id}")
async def delete_service(
    service_id: str,
    current_user: dict = Depends(get_current_user)
):
    if not ObjectId.is_valid(service_id):
        raise HTTPException(status_code=400, detail="Invalid service ID")

    try:
        service = await services_collection.find_one({"_id": ObjectId(service_id)})
    except PyMongoError as error:
        database_unavailable(error)

    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    if service["owner_uid"] != current_user["uid"]:
        raise HTTPException(status_code=403, detail="You can only delete your own service")

    try:
        await services_collection.delete_one({"_id": ObjectId(service_id)})
    except PyMongoError as error:
        database_unavailable(error)

    return {
        "success": True,
        "message": "Service deleted successfully"
    }
