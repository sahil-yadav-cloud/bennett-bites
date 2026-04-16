"""
routers/admin_router.py
-----------------------
All routes here require a valid Admin JWT (via `require_admin` dependency).

Endpoints
  POST   /admin/add-food        — upload a new food item with an image
  PATCH  /admin/food/{id}       — update price / name / category / calories
  DELETE /admin/food/{id}       — remove a food item
  GET    /admin/orders          — list all orders across all users
  PATCH  /admin/orders/{id}     — update order status
"""

import os
import shutil
import uuid
from typing import Optional

from fastapi import (
    APIRouter, Depends, File, Form,
    HTTPException, UploadFile, status,
)
from sqlalchemy.orm import Session

from auth import require_admin
from database import get_db
from models import FoodItem, Order, User
from schemas import FoodItemOut, MessageResponse, OrderOut

router = APIRouter(prefix="/admin", tags=["Admin"])

# Where uploaded images are stored on disk
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Permitted image MIME types
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _save_image(file: UploadFile) -> str:
    """
    Save an uploaded image to UPLOAD_DIR with a UUID filename.
    Returns the relative URL path, e.g. "/static/uploads/abc123.jpg".
    Raises HTTPException 400 on bad file type or 500 on IO error.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported image type '{file.content_type}'. "
                   f"Allowed: {', '.join(ALLOWED_CONTENT_TYPES)}",
        )

    ext      = os.path.splitext(file.filename or "image")[1] or ".jpg"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest     = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(dest, "wb") as out_file:
            shutil.copyfileobj(file.file, out_file)
    except OSError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save image: {exc}",
        )

    return f"/static/uploads/{filename}"


# ---------------------------------------------------------------------------
# POST /admin/add-food
# ---------------------------------------------------------------------------
@router.post(
    "/add-food",
    response_model=FoodItemOut,
    status_code=status.HTTP_201_CREATED,
    summary="[Admin] Add a new food item with an image",
)
def add_food(
    name:     str        = Form(..., description="Display name of the item",     examples=["Masala Dosa"]),
    price:    float      = Form(..., gt=0, description="Price in INR",           examples=[75.0]),
    calories: int        = Form(..., ge=0, description="Approximate kcal count", examples=[350]),
    category: str        = Form(..., description="Menu section name",            examples=["Meals"]),
    image:    UploadFile = File(..., description="JPEG / PNG / WebP image"),
    db:       Session    = Depends(get_db),
    _admin:   User       = Depends(require_admin),
):
    """
    **Admin only.** Accepts `multipart/form-data`.

    The uploaded image is written to `/static/uploads/` and the relative
    URL is stored in `image_url`.

    | Field      | Type        | Required | Notes                  |
    |------------|-------------|----------|------------------------|
    | name       | string      | ✓        |                        |
    | price      | float       | ✓        | Must be > 0            |
    | calories   | int         | ✓        | Must be ≥ 0            |
    | category   | string      | ✓        | e.g. Meals, Snacks     |
    | image      | file upload | ✓        | JPEG / PNG / WebP      |
    """
    image_url = _save_image(image)

    item = FoodItem(
        name=name,
        price=price,
        calories=calories,
        category=category,
        image_url=image_url,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ---------------------------------------------------------------------------
# PATCH /admin/food/{id}
# ---------------------------------------------------------------------------
@router.patch(
    "/food/{item_id}",
    response_model=FoodItemOut,
    summary="[Admin] Update a food item",
)
def update_food(
    item_id:  int,
    name:     Optional[str]   = Form(None),
    price:    Optional[float] = Form(None, gt=0),
    calories: Optional[int]   = Form(None, ge=0),
    category: Optional[str]   = Form(None),
    image:    Optional[UploadFile] = File(None),
    db:       Session = Depends(get_db),
    _admin:   User    = Depends(require_admin),
):
    """**Admin only.** Update any fields on an existing food item."""
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Food item {item_id} not found.")

    if name     is not None: item.name     = name
    if price    is not None: item.price    = price
    if calories is not None: item.calories = calories
    if category is not None: item.category = category
    if image    is not None: item.image_url = _save_image(image)

    db.commit()
    db.refresh(item)
    return item


# ---------------------------------------------------------------------------
# DELETE /admin/food/{id}
# ---------------------------------------------------------------------------
@router.delete(
    "/food/{item_id}",
    response_model=MessageResponse,
    summary="[Admin] Delete a food item",
)
def delete_food(
    item_id: int,
    db:      Session = Depends(get_db),
    _admin:  User    = Depends(require_admin),
):
    """**Admin only.** Permanently remove a food item from the menu."""
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Food item {item_id} not found.")
    db.delete(item)
    db.commit()
    return MessageResponse(message=f"Food item '{item.name}' deleted.")


# ---------------------------------------------------------------------------
# GET /admin/orders
# ---------------------------------------------------------------------------
@router.get(
    "/orders",
    response_model=list[OrderOut],
    summary="[Admin] List all orders across all users",
)
def list_all_orders(
    status_filter: Optional[str] = None,
    db:     Session = Depends(get_db),
    _admin: User    = Depends(require_admin),
):
    """**Admin only.** Returns every order. Optionally filter by status."""
    q = db.query(Order)
    if status_filter:
        q = q.filter(Order.status.ilike(status_filter))
    return q.order_by(Order.created_at.desc()).all()


# ---------------------------------------------------------------------------
# PATCH /admin/orders/{id}
# ---------------------------------------------------------------------------
VALID_STATUSES = {"Pending", "Preparing", "Ready", "Delivered", "Cancelled"}


@router.patch(
    "/orders/{order_id}",
    response_model=OrderOut,
    summary="[Admin] Update order status",
)
def update_order_status(
    order_id:   int,
    new_status: str     = Form(..., examples=["Preparing"]),
    db:         Session = Depends(get_db),
    _admin:     User    = Depends(require_admin),
):
    """
    **Admin only.** Move an order through its lifecycle.

    Valid statuses: `Pending`, `Preparing`, `Ready`, `Delivered`, `Cancelled`
    """
    if new_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Choose from: {', '.join(sorted(VALID_STATUSES))}",
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found.")

    order.status = new_status
    db.commit()
    db.refresh(order)
    return order
