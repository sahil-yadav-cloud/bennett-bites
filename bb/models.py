"""
models.py
---------
SQLAlchemy ORM table definitions.

Tables
------
users       — registered students / admins
food_items  — menu items with optional uploaded image
orders      — one row per placed order
order_items — line-items that belong to an order (many-to-many bridge)
"""

from datetime import datetime
from sqlalchemy import (
    Boolean, Column, DateTime, Float,
    ForeignKey, Integer, String, Text,
)
from sqlalchemy.orm import relationship

from database import Base


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    is_admin        = Column(Boolean, default=False, nullable=False)

    # Reverse relation — handy for history queries
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} admin={self.is_admin}>"


# ---------------------------------------------------------------------------
# FoodItem
# ---------------------------------------------------------------------------
class FoodItem(Base):
    __tablename__ = "food_items"

    id        = Column(Integer, primary_key=True, index=True)
    name      = Column(String(120), nullable=False)
    price     = Column(Float, nullable=False)
    calories  = Column(Integer, default=0)
    category  = Column(String(80), nullable=False)
    image_url = Column(Text, default="")   # relative path served by /static

    # Reverse relation
    order_items = relationship("OrderItem", back_populates="food_item")

    def __repr__(self) -> str:
        return f"<FoodItem id={self.id} name={self.name} price={self.price}>"


# ---------------------------------------------------------------------------
# Order
# ---------------------------------------------------------------------------
class Order(Base):
    __tablename__ = "orders"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False, default=0.0)
    status      = Column(String(30), nullable=False, default="Pending")
    created_at  = Column(DateTime, default=datetime.utcnow, nullable=False)

    user        = relationship("User", back_populates="orders")
    items       = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Order id={self.id} user_id={self.user_id} status={self.status}>"


# ---------------------------------------------------------------------------
# OrderItem  (bridge between Order and FoodItem)
# ---------------------------------------------------------------------------
class OrderItem(Base):
    __tablename__ = "order_items"

    id           = Column(Integer, primary_key=True, index=True)
    order_id     = Column(Integer, ForeignKey("orders.id"), nullable=False)
    food_item_id = Column(Integer, ForeignKey("food_items.id"), nullable=False)
    quantity     = Column(Integer, default=1, nullable=False)
    unit_price   = Column(Float, nullable=False)   # snapshot of price at order time

    order      = relationship("Order", back_populates="items")
    food_item  = relationship("FoodItem", back_populates="order_items")
