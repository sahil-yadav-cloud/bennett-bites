"""
main.py
-------
Bennett Bites — FastAPI application entry point.

Start the server:
  uvicorn main:app --reload --port 8000

Interactive docs:
  http://localhost:8000/docs      (Swagger UI)
  http://localhost:8000/redoc     (ReDoc)
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import models
from database import engine, SessionLocal
from auth import hash_password
from routers.auth_router   import router as auth_router
from routers.menu_router   import router as menu_router
from routers.admin_router  import router as admin_router
from routers.orders_router import router as orders_router


# ---------------------------------------------------------------------------
# Startup logic — create tables + seed one demo admin on first run
# ---------------------------------------------------------------------------
def _create_tables():
    models.Base.metadata.create_all(bind=engine)


def _seed_demo_data():
    """
    Insert a demo admin + a few menu items only when the DB is empty.
    Safe to call repeatedly (guards with a count check).
    """
    db = SessionLocal()
    try:
        # ── Admin user ──────────────────────────────────────────────────────
        if db.query(models.User).count() == 0:
            admin = models.User(
                email="admin@bennett.edu.in",
                hashed_password=hash_password("admin123"),
                is_admin=True,
            )
            db.add(admin)

            student = models.User(
                email="student@bennett.edu.in",
                hashed_password=hash_password("student123"),
                is_admin=False,
            )
            db.add(student)
            print("✅  Demo users created")
            print("    admin@bennett.edu.in   / admin123")
            print("    student@bennett.edu.in / student123")

        # ── Menu items ──────────────────────────────────────────────────────
        if db.query(models.FoodItem).count() == 0:
            items = [
                models.FoodItem(name="Masala Dosa",        price=75.0,  calories=350, category="Meals",      image_url=""),
                models.FoodItem(name="Paneer Butter Masala",price=110.0, calories=480, category="Meals",      image_url=""),
                models.FoodItem(name="Veg Biryani",        price=90.0,  calories=520, category="Meals",      image_url=""),
                models.FoodItem(name="Samosa (2 pcs)",     price=20.0,  calories=180, category="Snacks",     image_url=""),
                models.FoodItem(name="Cold Coffee",        price=55.0,  calories=210, category="Beverages",  image_url=""),
                models.FoodItem(name="Mango Lassi",        price=60.0,  calories=240, category="Beverages",  image_url=""),
                models.FoodItem(name="Chocolate Brownie",  price=45.0,  calories=310, category="Desserts",   image_url=""),
            ]
            db.add_all(items)
            print("✅  Demo menu seeded (7 items)")

        db.commit()
    except Exception as exc:
        db.rollback()
        print(f"⚠️  Seeding skipped: {exc}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Runs once at startup before the server accepts requests."""
    _create_tables()
    _seed_demo_data()
    yield
    # (add shutdown cleanup here if needed)


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Bennett Bites API",
    description=(
        "Campus food ordering system for Bennett University.\n\n"
        "**Auth flow:**\n"
        "1. `POST /auth/login` → get a Bearer token\n"
        "2. Click **Authorize** (🔒) in Swagger and paste the token\n"
        "3. All protected endpoints now work"
    ),
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS  — allows the frontend dev server at localhost:5500 to call us
# ---------------------------------------------------------------------------
ALLOWED_ORIGINS = [
    "http://localhost:5500",     # VS Code Live Server / frontend dev
    "http://127.0.0.1:5500",
    "http://localhost:3000",     # React / Vite dev servers (bonus)
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Static files  — serves uploaded images at /static/uploads/<filename>
# ---------------------------------------------------------------------------
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(os.path.join(STATIC_DIR, "uploads"), exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth_router)
app.include_router(menu_router)
app.include_router(admin_router)
app.include_router(orders_router)


# ---------------------------------------------------------------------------
# Root health-check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"], summary="API health check")
def root():
    """Returns a simple alive message. Use `/docs` to explore all endpoints."""
    return {
        "status":  "ok",
        "service": "Bennett Bites API",
        "docs":    "/docs",
    }
