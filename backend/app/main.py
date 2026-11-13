import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

import uvicorn
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from google.oauth2 import id_token
from google.auth.transport import requests
from jose import jwt, JWTError

from app.database.session import engine, Base
from app.api import (
    upload,
    chat,
    prediction,
    report,
    prediction_manager,
)

# --------------------------------------------------
# ENVIRONMENT CONFIGURATION
# --------------------------------------------------

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24


# --------------------------------------------------
# VALIDATE CONFIGURATION
# --------------------------------------------------

if not GOOGLE_CLIENT_ID:
    logger.warning("GOOGLE_CLIENT_ID is not configured.")

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY is missing from environment variables.")


# --------------------------------------------------
# DATABASE INITIALIZATION
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception:
        logger.exception("Database initialization failed.")
        raise

    yield


# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="ADP-AI Multi-Task Predictive Framework Engine",
    description="AI-powered multi-task predictive framework.",
    version="1.0.0",
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


# --------------------------------------------------
# AUTHENTICATION CONFIGURATION
# --------------------------------------------------

class GoogleToken(BaseModel):
    token: str = Field(min_length=1)


# --------------------------------------------------
# JWT ACCESS TOKEN GENERATION
# --------------------------------------------------

def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        hours=ACCESS_TOKEN_EXPIRE_HOURS
    )

    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# --------------------------------------------------
# GOOGLE AUTHENTICATION
# --------------------------------------------------

@app.post("/auth/google")
async def google_login(payload: GoogleToken):

    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="Google authentication is not configured."
        )

    try:
        idinfo = id_token.verify_oauth2_token(
            payload.token,
            requests.Request(),
            GOOGLE_CLIENT_ID,
        )

        # Validate email
        email = idinfo.get("email")

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Email not found in Google account."
            )

        if not idinfo.get("email_verified", False):
            raise HTTPException(
                status_code=401,
                detail="Google email is not verified."
            )

        name = idinfo.get("name")
        picture = idinfo.get("picture")
        google_id = idinfo.get("sub")

        if not google_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid Google account information."
            )

        # Generate JWT
        access_token = create_access_token({
            "sub": email,
            "name": name,
            "google_id": google_id,
        })

        return {
            "message": "Google login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": email,
                "name": name,
                "picture": picture,
                "google_id": google_id,
            },
        }

    except HTTPException:
        raise

    except ValueError:
        logger.warning("Google token verification failed.")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Google token."
        )

    except Exception:
        logger.exception("Google authentication error.")
        raise HTTPException(
            status_code=500,
            detail="Google authentication failed."
        )


# --------------------------------------------------
# API ROUTER REGISTRATION
# --------------------------------------------------

app.include_router(upload.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(prediction.router, prefix="/api")
app.include_router(report.router, prefix="/api")
app.include_router(prediction_manager.router, prefix="/api")


# --------------------------------------------------
# ROOT HEALTH CHECK
# --------------------------------------------------

@app.get("/")
async def root():
    return {
        "message": "ADP-AI Backend is running",
        "status": "healthy",
    }


# --------------------------------------------------
# APPLICATION ENTRY POINT
# --------------------------------------------------

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
