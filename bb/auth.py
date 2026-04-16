"""
auth.py
-------
Everything authentication-related lives here:

  • password hashing / verification  (bcrypt via passlib)
  • JWT creation / decoding          (python-jose)
  • FastAPI dependencies             (get_current_user, require_admin)

Config is read from environment variables so secrets never live in code.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from database import get_db
from models import User

# ---------------------------------------------------------------------------
# Config  (override via environment variables in production)
# ---------------------------------------------------------------------------
SECRET_KEY:  str = os.getenv("JWT_SECRET_KEY",  "CHANGE_ME_in_production_use_a_long_random_string")
ALGORITHM:   str = os.getenv("JWT_ALGORITHM",    "HS256")
TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# ---------------------------------------------------------------------------
# Password hashing
# ---------------------------------------------------------------------------
_pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """Return a bcrypt hash of *plain*."""
    return _pwd_ctx.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches the stored *hashed* password."""
    return _pwd_ctx.verify(plain, hashed)


# ---------------------------------------------------------------------------
# JWT helpers
# ---------------------------------------------------------------------------
def create_access_token(user_id: int, is_admin: bool) -> str:
    """
    Create a signed JWT.

    Payload includes:
      sub      — user ID as string  (standard claim)
      is_admin — bool flag for role checks
      exp      — expiry timestamp   (standard claim, added by jose)
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub":      str(user_id),
        "is_admin": is_admin,
        "exp":      expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def _decode_token(token: str) -> dict:
    """Decode and verify a JWT. Raises HTTPException 401 on any failure."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# FastAPI OAuth2 scheme  (reads "Authorization: Bearer <token>" header)
# ---------------------------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------------------------------------------------------------------------
# Dependencies
# ---------------------------------------------------------------------------
def get_current_user(
    token: str      = Depends(oauth2_scheme),
    db:    Session  = Depends(get_db),
) -> User:
    """
    Dependency: parse the JWT, look up the user in the DB, and return it.
    Raises 401 if the token is bad, or 404 if the user no longer exists.
    """
    payload = _decode_token(token)
    user_id: Optional[str] = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload.")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency: same as get_current_user but also checks is_admin.
    Use on any admin-only endpoint.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required.",
        )
    return current_user
