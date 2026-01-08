from fastapi import FastAPI
from sqlmodel import SQLModel

from app.config.settings import settings
from app.db import engine
from app.api.users import router as users_router
from app.api.config import router as config_router
from app.models.user import User  # noqa: F401
from app.models.onboarding_config import OnboardingConfig  # noqa: F401
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(users_router)
app.include_router(config_router)


@app.on_event("startup")
def on_startup():
    """
    Runs when the application starts.

    Ensures all tables are created.
    """
    print("DB URL from settings:", settings.database_url)
    SQLModel.metadata.create_all(engine)
    print("✅ Database tables created (or already exist).")


@app.get("/health")
def health_check():
    """
    Simple health check.
    """
    return {"status": "ok"}
