from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """
    Central place for application settings.

    Supports two ways to configure DB:
    1) DATABASE_URL (recommended for Docker/deployment)
    2) MYSQL_* pieces (your current local-dev style)
    """

    # ✅ Preferred (one variable)
    DATABASE_URL: Optional[str] = None

    # ✅ Fallback pieces (works locally)
    MYSQL_USER: str = "onboard_user"
    MYSQL_PASSWORD: str = "OnboardPass123!"
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str = "onboarding_app"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        """
        If DATABASE_URL is set, use it.
        Otherwise build the MySQL URL from MYSQL_* pieces.
        """
        if self.DATABASE_URL:
            return self.DATABASE_URL

        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )


settings = Settings()
__all__ = ["settings"]
