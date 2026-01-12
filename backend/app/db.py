import os
from sqlmodel import SQLModel, Session, create_engine

from app.config.settings import settings


def _build_connect_args_and_url():
    """
    Aiven requires SSL. On Render we will mount a CA cert file as a Secret File.
    If the cert exists, we enable SSL for PyMySQL using connect_args.

    IMPORTANT:
    - PyMySQL does NOT understand '?ssl-mode=REQUIRED' in the URL
    - So we remove it if present, and use connect_args instead.
    """
    db_url = settings.database_url

    # Remove unsupported query param if it exists
    db_url = db_url.replace("?ssl-mode=REQUIRED", "")
    db_url = db_url.replace("&ssl-mode=REQUIRED", "")

    connect_args = {}

    ca_path = "/etc/secrets/aiven-ca.pem"
    if os.path.exists(ca_path):
        connect_args = {"ssl": {"ca": ca_path}}

    return db_url, connect_args


db_url, connect_args = _build_connect_args_and_url()
print("DB URL from settings:", db_url)

engine = create_engine(db_url, echo=False, connect_args=connect_args)


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency used by FastAPI routes.
    """
    with Session(engine) as session:
        yield session
