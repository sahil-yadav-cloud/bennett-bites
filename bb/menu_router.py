"""
routers/menu_router.py
----------------------
Endpoints
  GET /menu            — list all available food items
  GET /menu/{item_id}  — single item detail
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models import FoodItem
from schemas import FoodItemOut

router = APIRouter(prefix="/menu", tags=["Menu"])


# ---------------------------------------------------------------------------
# List all items  (with optional category filter)
# ---------------------------------------------------------------------------
@router.get(
    "",
    response_model=List[FoodItemOut],
    summary="Get the full menu",
)
def get_menu(
    category: Optional[str] = Query(
        None,
        description="Filter by category, e.g. `Snacks`, `Beverages`, `Meals`",
        examples=["Meals"],
    ),
    db: Session = Depends(get_db),
):
    """
    Returns all food items.

    Pass **?category=Meals** to filter by a specific category.
    No authentication required — anyone can browse the menu.
    """
    query = db.query(FoodItem)
    if category:
        query = query.filter(FoodItem.category.ilike(f"%{category}%"))
    return query.order_by(FoodItem.category, FoodItem.name).all()


# ---------------------------------------------------------------------------
# Single item
# ---------------------------------------------------------------------------
@router.get(
    "/{item_id}",
    response_model=FoodItemOut,
    summary="Get a single menu item by ID",
)
def get_food_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"Food item {item_id} not found.")
    return item
