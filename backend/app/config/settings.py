from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central place for application settings.

    Priority:
    1) If DATABASE_URL is provided (Render / Docker), use it
    2) Otherwise build a URL from MYSQL_* values (local dev)
    """

    # ✅ This will be provided in Render
    DATABASE_URL: str | None = None

    # Local defaults (for macOS dev)
    MYSQL_USER: str = "onboard_user"
    MYSQL_PASSWORD: str = "OnboardPass123!"
    MYSQL_HOST: str = "127.0.0.1"
    MYSQL_PORT: int = 3306
    MYSQL_DB: str = "onboarding_app"

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL

        return (
            f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}"
            f"@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}"
        )


settings = Settings()
__all__ = ["settings"]
