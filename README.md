# SkillBridge Lite

Full-stack freelance services marketplace built with React, Firebase Auth, FastAPI, MongoDB Atlas, and Cloudinary.

## Local Development

Backend:

```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Frontend:

```powershell
cd frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

## Required Setup

- Firebase Authentication: enable Email/Password sign-in.
- MongoDB Atlas: allow your current IP address in Network Access.
- Cloudinary: set cloud name, API key, and API secret.

## Deploy Notes

Frontend goes to Vercel from the `frontend` directory.

Backend goes to Render from the `backend` directory with:

```text
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
```

Set every variable from `backend/.env.example` in Render and every variable from `frontend/.env.example` in Vercel.

For Render Firebase Admin, prefer `FIREBASE_SERVICE_ACCOUNT_JSON` with the full service account JSON as one environment variable. Do not commit service account JSON files.
