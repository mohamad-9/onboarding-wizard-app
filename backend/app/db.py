import os
from sqlmodel import SQLModel, Session, create_engine

from app.config.settings import settings

# If Render Secret File is used, this env points to its path:
# /etc/secrets/aiven-ca.pem (example)
AIVEN_CA_PATH = os.getenv("AIVEN_CA_PATH")

connect_args = {}

# If we have a CA path, enforce SSL
if AIVEN_CA_PATH:
    connect_args = {
        "ssl": {
            "ca": AIVEN_CA_PATH
        }
    }

engine = create_engine(
    settings.database_url,
    echo=False,
    connect_args=connect_args
)

def get_session():
    with Session(engine) as session:
        yield session
