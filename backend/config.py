import os
from pathlib import Path
from urllib.parse import parse_qsl, quote_plus, unquote_plus, urlencode
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def _resolve_backend_path(path_value: str | None) -> str | None:
    if not path_value:
        return None

    path = Path(path_value)
    if not path.is_absolute():
        path = BASE_DIR / path

    return str(path.resolve())


def _service_account_path() -> str:
    configured_path = _resolve_backend_path(
        os.getenv("FIREBASE_SERVICE_ACCOUNT_PATH", "./firebase-service-account.json")
    )

    candidates = [
        configured_path,
        str(BASE_DIR / "skillbridge-lite-446f7-firebase-adminsdk-fbsvc-c42936fdc0.json"),
        str(BASE_DIR / "firebase-service-account.json"),
    ]

    for candidate in candidates:
        if candidate and Path(candidate).is_file() and Path(candidate).stat().st_size > 0:
            return candidate

    return configured_path or str(BASE_DIR / "firebase-service-account.json")


def _mongo_uri() -> str | None:
    uri = os.getenv("MONGO_URI")
    if not uri or "://" not in uri:
        return uri

    scheme, remainder = uri.split("://", 1)
    if "@" not in remainder:
        return uri

    userinfo, hosts_and_options = remainder.rsplit("@", 1)
    if ":" not in userinfo:
        return uri

    username, password = userinfo.split(":", 1)
    username = quote_plus(unquote_plus(username))
    password = quote_plus(unquote_plus(password))
    hosts_and_options = _normalize_mongo_options(hosts_and_options)

    return f"{scheme}://{username}:{password}@{hosts_and_options}"


def _normalize_mongo_options(hosts_and_options: str) -> str:
    if "?" not in hosts_and_options:
        return hosts_and_options

    hosts, query_string = hosts_and_options.split("?", 1)
    options = parse_qsl(query_string, keep_blank_values=True)
    normalized_options = []

    for key, value in options:
        if key == os.getenv("DATABASE_NAME", "skillbridge_lite"):
            normalized_options.append(("appName", value))
        else:
            normalized_options.append((key, value))

    return f"{hosts}?{urlencode(normalized_options)}"


def _csv_env(name: str, default: str = "") -> list[str]:
    return [
        item.strip()
        for item in os.getenv(name, default).split(",")
        if item.strip()
    ]

class Settings:
    PORT = int(os.getenv("PORT", 8000))
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

    MONGO_URI = _mongo_uri()
    DATABASE_NAME = os.getenv("DATABASE_NAME", "skillbridge_lite")

    CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

    FIREBASE_SERVICE_ACCOUNT_PATH = _service_account_path()
    FIREBASE_SERVICE_ACCOUNT_JSON = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

    CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:5173")
    CORS_ORIGINS = _csv_env(
        "CORS_ORIGINS",
        f"{CLIENT_URL},http://localhost:5173,http://127.0.0.1:5173"
    )

settings = Settings()
