from sqlmodel import create_engine, Session
from app.config.settings import settings


# Create the global database engine using the URL from our settings
engine = create_engine(settings.database_url, echo=True)
# echo=True means SQL queries will be printed in the terminal (useful for learning)


def get_session():
    """
    Dependency function to provide a database session.

    Later, we'll use this with FastAPI's dependency injection
    to get a Session in our endpoint functions.
    """
    with Session(engine) as session:
        yield session
