from sqlmodel import create_engine, Session
from app.config.settings import settings


def _connect_args() -> dict:
    if settings.MYSQL_SSL_CA:
        return {"ssl": {"ca": settings.MYSQL_SSL_CA}}
    return {}


engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args=_connect_args(),
    pool_pre_ping=True,
)


def get_session():
    with Session(engine) as session:
        yield session
