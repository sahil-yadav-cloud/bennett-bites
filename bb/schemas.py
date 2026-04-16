"""
schemas.py
----------
Pydantic v2 models used for:
  • request body validation
  • response serialisation
  • OpenAPI schema generation

Naming convention
-----------------
  <Entity>Base    — shared fields (no id, no computed fields)
  <Entity>Create  — fields accepted on POST/PUT
  <Entity>Out     — what the API returns to clients
"""

import re
from typing import List, Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
BENNETT_EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@bennett\.edu\.in$", re.IGNORECASE)


# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------
class LoginRequest(BaseModel):
    email:    EmailStr = Field(..., examples=["student@bennett.edu.in"])
    password: str      = Field(..., min_length=6, examples=["secret123"])

    @field_validator("email")
    @classmethod
    def must_be_bennett_email(cls, v: str) -> str:
        if not BENNETT_EMAIL_RE.match(v):
            raise ValueError("Only @bennett.edu.in email addresses are allowed.")
        return v.lower()


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------
class UserCreate(BaseModel):
    email:    EmailStr = Field(..., examples=["student@bennett.edu.in"])
    password: str      = Field(..., min_length=6)
    is_admin: bool     = False

    @field_validator("email")
    @classmethod
    def must_be_bennett_email(cls, v: str) -> str:
        if not BENNETT_EMAIL_RE.match(v):
            raise ValueError("Only @bennett.edu.in email addresses are allowed.")
        return v.lower()


class UserOut(BaseModel):
    id:       int
    email:    str
    is_admin: bool

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# FoodItem
# ---------------------------------------------------------------------------
class FoodItemOut(BaseModel):
    id:        int
    name:      str
    price:     float
    calories:  int
    category:  str
    image_url: str

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Order
# ---------------------------------------------------------------------------
class OrderItemIn(BaseModel):
    """A single line-item inside a new order request."""
    food_item_id: int   = Field(..., gt=0, examples=[1])
    quantity:     int   = Field(1, ge=1, le=50, examples=[2])


class OrderCreate(BaseModel):
    items: List[OrderItemIn] = Field(..., min_length=1)


class OrderItemOut(BaseModel):
    food_item_id: int
    quantity:     int
    unit_price:   float

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id:          int
    user_id:     int
    total_price: float
    status:      str
    created_at:  datetime
    items:       List[OrderItemOut]

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Generic response wrappers
# ---------------------------------------------------------------------------
class MessageResponse(BaseModel):
    message: str


class ErrorDetail(BaseModel):
    detail: str
