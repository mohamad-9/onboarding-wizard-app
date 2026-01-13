from fastapi import FastAPI
from sqlmodel import SQLModel

from app.db import engine
from app.api.users import router as users_router
from app.api.config import router as config_router

app = FastAPI()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.include_router(users_router, prefix="/api")
app.include_router(config_router, prefix="/api")

@app.get("/healthz")
def healthz():
    return {"ok": True}
