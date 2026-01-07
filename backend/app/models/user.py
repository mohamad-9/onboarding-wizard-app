from typing import Optional
from datetime import datetime, date

from sqlmodel import SQLModel, Field


class User(SQLModel, table=True):
    """
    User table.

    This stores all data collected in the onboarding wizard.
    """

    id: Optional[int] = Field(default=None, primary_key=True)

    email: str = Field(index=True)
    password: str

    # Optional fields for later steps in onboarding
    about_me: Optional[str] = None

    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None

    birthdate: Optional[date] = None

    step2_completed: bool = Field(default=False)
    step3_completed: bool = Field(default=False)

    created_at: datetime = Field(default_factory=datetime.utcnow)
