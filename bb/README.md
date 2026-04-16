# 🍔 Bennett Bites — Python Backend

A clean, modular **FastAPI** backend for the Bennett University campus food ordering system.

---

## Quick Start

```bash
# 1. Clone / copy the project folder
cd bennett_bites

# 2. Create a virtual environment (recommended)
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the server
uvicorn main:app --reload --port 8000
```

Open **http://localhost:8000/docs** for the interactive Swagger UI.

---

## Project Structure

```
bennett_bites/
│
├── main.py               ← App entry point: CORS, routers, startup hook
├── database.py           ← SQLAlchemy engine, SessionLocal, get_db()
├── models.py             ← ORM table definitions (User, FoodItem, Order, …)
├── schemas.py            ← Pydantic request/response models + email validation
├── auth.py               ← JWT creation/decoding, password hashing, dependencies
│
├── routers/
│   ├── auth_router.py    ← POST /auth/register  POST /auth/login
│   ├── menu_router.py    ← GET  /menu           GET  /menu/{id}
│   ├── admin_router.py   ← POST /admin/add-food  (+ update / delete / orders)
│   └── orders_router.py  ← POST /orders          GET  /orders
│
├── static/
│   └── uploads/          ← Uploaded food images land here
│
├── requirements.txt
└── README.md
```

---

## Demo Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@bennett.edu.in       | admin123    |
| Student | student@bennett.edu.in     | student123  |

> Seeded automatically on first run.

---

## Endpoint Reference

### Authentication

| Method | Path             | Auth | Description                        |
|--------|------------------|------|------------------------------------|
| POST   | /auth/register   | —    | Create a new student account       |
| POST   | /auth/login      | —    | Get a JWT Bearer token             |

**Login request body:**
```json
{ "email": "student@bennett.edu.in", "password": "student123" }
```

**Login response:**
```json
{ "access_token": "<jwt>", "token_type": "bearer" }
```

Use the token in all protected calls:
```
Authorization: Bearer <token>
```

---

### Menu (public)

| Method | Path          | Auth | Description                           |
|--------|---------------|------|---------------------------------------|
| GET    | /menu         | —    | All food items (`?category=Meals`)    |
| GET    | /menu/{id}    | —    | Single item                           |

---

### Admin (requires Admin JWT)

| Method | Path                  | Auth  | Description                         |
|--------|-----------------------|-------|-------------------------------------|
| POST   | /admin/add-food       | Admin | Upload new item (`multipart/form`)  |
| PATCH  | /admin/food/{id}      | Admin | Update item fields / image          |
| DELETE | /admin/food/{id}      | Admin | Remove item                         |
| GET    | /admin/orders         | Admin | All orders across all users         |
| PATCH  | /admin/orders/{id}    | Admin | Update order status                 |

**add-food form fields:**

| Field    | Type   | Required | Notes               |
|----------|--------|----------|---------------------|
| name     | string | ✓        |                     |
| price    | float  | ✓        | > 0                 |
| calories | int    | ✓        | ≥ 0                 |
| category | string | ✓        | e.g. Meals, Snacks  |
| image    | file   | ✓        | JPEG / PNG / WebP   |

---

### Orders (requires any valid JWT)

| Method | Path          | Auth  | Description                      |
|--------|---------------|-------|----------------------------------|
| POST   | /orders       | User  | Place an order                   |
| GET    | /orders       | User  | Your order history               |
| GET    | /orders/{id}  | User  | Single order detail              |

**Place order body:**
```json
{
  "items": [
    { "food_item_id": 1, "quantity": 2 },
    { "food_item_id": 4, "quantity": 1 }
  ]
}
```

---

## Email Validation Rule

Only `@bennett.edu.in` addresses are accepted.  
The validator is in `schemas.py` and applies to both `/auth/register` and `/auth/login`.

---

## Environment Variables

| Variable                      | Default                        | Description              |
|-------------------------------|--------------------------------|--------------------------|
| `JWT_SECRET_KEY`              | (insecure default)             | Change before deploying! |
| `JWT_ALGORITHM`               | HS256                          |                          |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 60                             | Token lifetime           |

Set them in a `.env` file and load with `python-dotenv` for production.

---

## Database

SQLite file `bennett_bites.db` is created automatically next to `main.py`.  
To switch to PostgreSQL, change one line in `database.py`:

```python
DATABASE_URL = "postgresql+psycopg2://user:password@localhost/bennett_bites"
```

---

## Uploaded Images

Images are saved to `static/uploads/` with a UUID filename and served at:
```
http://localhost:8000/static/uploads/<filename>
```
The `image_url` field in `FoodItem` stores this path.
