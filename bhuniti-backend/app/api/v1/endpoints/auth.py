from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User
from app.schemas.auth import LoginRequest, Token, UserCreate, UserResponse
from app.api.deps import get_current_user

router = APIRouter()

# Demo credentials mapping for quick fallback
DEMO_USERS = {
    "citizen": {"role": "citizen", "name": "Rahul Sharma", "redirect": "/citizen"},
    "revenue_officer": {"role": "revenue_officer", "name": "Suresh Verma (RO)", "redirect": "/revenue-officer"},
    "district_officer": {"role": "district_officer", "name": "District Magistrate Office", "redirect": "/administration"},
}

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    username = login_data.username.strip()
    password = login_data.password.strip()

    # 1. Check in database first
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalars().first()

    if user and verify_password(password, user.hashed_password):
        redirect_map = {
            "citizen": "/citizen",
            "revenue_officer": "/revenue-officer",
            "district_officer": "/administration"
        }
        redirect_url = redirect_map.get(user.role, "/citizen")
        token = create_access_token(subject=user.username, role=user.role)
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role,
            "username": user.username,
            "full_name": user.full_name or user.username,
            "redirect_url": redirect_url
        }

    # 2. Check demo credentials fallback (1234)
    if username in DEMO_USERS and password == "1234":
        demo_info = DEMO_USERS[username]
        token = create_access_token(subject=username, role=demo_info["role"])
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": demo_info["role"],
            "username": username,
            "full_name": demo_info["name"],
            "redirect_url": demo_info["redirect"]
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return current_user

@router.post("/register", response_model=UserResponse)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(User).where(User.username == user_in.username))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        role=user_in.role,
        full_name=user_in.full_name,
        phone=user_in.phone,
        district=user_in.district,
        tehsil=user_in.tehsil
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
