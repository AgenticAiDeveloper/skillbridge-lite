import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings

security = HTTPBearer(auto_error=False)

if not firebase_admin._apps:
    if settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        service_account_info = settings.FIREBASE_SERVICE_ACCOUNT_JSON
        if isinstance(service_account_info, str):
            import json

            service_account_info = json.loads(service_account_info)
        cred = credentials.Certificate(service_account_info)
    else:
        cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)

    firebase_admin.initialize_app(cred)


async def get_current_user(
    credentials_data: HTTPAuthorizationCredentials | None = Depends(security)
):
    if not credentials_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if credentials_data.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header must use Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials_data.credentials

    try:
        decoded_token = auth.verify_id_token(token)

        return {
            "uid": decoded_token.get("uid"),
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name", ""),
        }

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase token",
            headers={"WWW-Authenticate": "Bearer"},
        )
