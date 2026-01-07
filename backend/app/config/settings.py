from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central place for application settings.

    Right now we use it for database configuration.
    Later we can load these from environment variables or a .env file.
    """

    MYSQL_USER: str = "onboard_user"
    MYSQL_PASSWORD: str = "OnboardPass123!"
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str = "onboarding_app"

    @property
    def database_url(self) -> str:
        """
        Build the full SQLAlchemy-style database URL for MySQL.
        Example:
        mysql+pymysql://user:password@127.0.0.1:3306/dbname
        """
        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )


# Create a single global settings object we can import anywhere
settings = Settings()
__all__ = ["settings"]