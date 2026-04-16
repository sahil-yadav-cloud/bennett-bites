"""
routers/auth_router.py
----------------------
Endpoints
  POST /auth/register  — create a new student account
  POST /auth/login     — exchange credentials for a JWT
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import create_access_token, hash_password, verify_password
from database import get_db
from models import User
from schemas import LoginRequest, TokenResponse, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ---------------------------------------------------------------------------
# Register
# ---------------------------------------------------------------------------
@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Bennett student account",
)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.

    - **email** must end with `@bennett.edu.in`
    - **password** minimum 6 characters
    - **is_admin** defaults to `false`; set `true` only in dev / seeding
    """
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"An account with {payload.email} already exists.",
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        is_admin=payload.is_admin,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------
@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive a JWT access token",
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate with a Bennett email and password.

    Returns a **Bearer** JWT token. Include it in subsequent requests:
    ```
    Authorization: Bearer <token>
    ```
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(user_id=user.id, is_admin=user.is_admin)
    return TokenResponse(access_token=token)
