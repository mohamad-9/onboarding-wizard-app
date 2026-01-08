from datetime import datetime, date
from typing import Optional

from sqlmodel import SQLModel




class UserStartRequest(SQLModel):
    """
    Request body for starting onboarding (step 1).
    """
    email: str
    password: str


class UserStep2Request(SQLModel):
    """
    Request body for saving step 2 data.

    We allow all fields to be optional because
    the admin config can toggle components on/off.
    """
    about_me: Optional[str] = None

    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None
    birthdate: Optional[date] = None



class UserStep3Request(SQLModel):
    about_me: Optional[str] = None

    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None

    birthdate: Optional[date] = None



class UserRead(SQLModel):
    """
    What we return to the frontend when reading user data.
    We intentionally DO NOT include the password field.
    """
    id: int
    email: str

    about_me: Optional[str] = None

    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip: Optional[str] = None

    birthdate: Optional[date] = None

    step2_completed: bool
    step3_completed: bool

    created_at: datetime
