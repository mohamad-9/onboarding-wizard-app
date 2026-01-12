from sqlmodel import SQLModel, create_engine
from app.config.settings import settings
import os

def make_engine():
    db_url = settings.database_url

    connect_args = {}

    # If Render secret file exists, use it for SSL
    ca_path = "/etc/secrets/aiven-ca.pem"
    if os.path.exists(ca_path):
        connect_args = {
            "ssl": {"ca": ca_path}
        }

        # Also: remove unsupported query params if they exist
        db_url = db_url.replace("?ssl-mode=REQUIRED", "")
        db_url = db_url.replace("&ssl-mode=REQUIRED", "")

    print("DB URL from settings:", db_url)

    return create_engine(db_url, echo=True, connect_args=connect_args)

engine = make_engine()
