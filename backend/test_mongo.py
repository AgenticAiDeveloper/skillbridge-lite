import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

mongo_uri = os.getenv("MONGO_URI")

print("Testing MongoDB connection...")
print("URI loaded:", "YES" if mongo_uri else "NO")

try:
    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=15000,
        connectTimeoutMS=15000,
        socketTimeoutMS=15000
    )

    client.admin.command("ping")
    print("MongoDB connected successfully ✅")

except Exception as e:
    print("MongoDB connection failed ❌")
    print(e)