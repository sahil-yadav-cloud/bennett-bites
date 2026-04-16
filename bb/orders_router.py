"""
routers/orders_router.py
------------------------
Student-facing order endpoints (all require a valid JWT).

Endpoints
  POST /orders          — place a new order from a list of item IDs
  GET  /orders          — list the current user's orders
  GET  /orders/{id}     — single order detail
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from auth import get_current_user
from database import get_db
from models import FoodItem, Order, OrderItem, User
from schemas import OrderCreate, OrderOut

router = APIRouter(prefix="/orders", tags=["Orders"])


# ---------------------------------------------------------------------------
# POST /orders
# ---------------------------------------------------------------------------
@router.post(
    "",
    response_model=OrderOut,
    status_code=status.HTTP_201_CREATED,
    summary="Place a new order",
)
def place_order(
    payload:      OrderCreate    = ...,
    db:           Session        = Depends(get_db),
    current_user: User           = Depends(get_current_user),
):
    """
    Place an order for one or more items.

    ```json
    {
      "items": [
        { "food_item_id": 1, "quantity": 2 },
        { "food_item_id": 3, "quantity": 1 }
      ]
    }
    ```

    - Validates every `food_item_id` exists in the menu.
    - Calculates `total_price` from current item prices.
    - Initial status is **Pending**.
    """
    total = 0.0
    order_items_to_add: List[OrderItem] = []

    for line in payload.items:
        food = db.query(FoodItem).filter(FoodItem.id == line.food_item_id).first()
        if not food:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item with id={line.food_item_id} does not exist.",
            )
        line_total = food.price * line.quantity
        total     += line_total

        order_items_to_add.append(
            OrderItem(
                food_item_id=food.id,
                quantity=line.quantity,
                unit_price=food.price,
            )
        )

    order = Order(
        user_id=current_user.id,
        total_price=round(total, 2),
        status="Pending",
    )
    db.add(order)
    db.flush()   # populate order.id without committing yet

    for oi in order_items_to_add:
        oi.order_id = order.id
        db.add(oi)

    db.commit()
    db.refresh(order)
    return order


# ---------------------------------------------------------------------------
# GET /orders  (current user's history)
# ---------------------------------------------------------------------------
@router.get(
    "",
    response_model=List[OrderOut],
    summary="List your orders",
)
def list_my_orders(
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    """Return all orders placed by the authenticated user, newest first."""
    return (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


# ---------------------------------------------------------------------------
# GET /orders/{id}
# ---------------------------------------------------------------------------
@router.get(
    "/{order_id}",
    response_model=OrderOut,
    summary="Get a single order",
)
def get_order(
    order_id:     int,
    db:           Session = Depends(get_db),
    current_user: User    = Depends(get_current_user),
):
    """
    Return a specific order.
    Students can only view **their own** orders.
    """
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found.",
        )
    return order
