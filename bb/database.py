"""
database.py
-----------
SQLAlchemy engine, session factory, and declarative Base.
All other modules import from here — nothing else touches the DB directly.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite file lives next to this module.
# Swap the URL for PostgreSQL in production:
#   postgresql+psycopg2://user:password@host/dbname
DATABASE_URL = "sqlite:///./bennett_bites.db"

engine = create_engine(
    DATABASE_URL,
    # Required for SQLite only — safe to remove for other DBs
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


# ---------------------------------------------------------------------------
# FastAPI dependency — yields a DB session and guarantees it is closed.
# Usage:  def route(db: Session = Depends(get_db)): ...
# ---------------------------------------------------------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
