from typing import Optional

from sqlmodel import SQLModel


class OnboardingConfigUpdate(SQLModel):
    """
    Request body for updating onboarding configuration via admin UI.
    """
    step2_about_me: Optional[bool] = None
    step2_address: Optional[bool] = None
    step2_birthdate: Optional[bool] = None

    step3_about_me: Optional[bool] = None
    step3_address: Optional[bool] = None
    step3_birthdate: Optional[bool] = None


class OnboardingConfigRead(SQLModel):
    """
    Response model for reading onboarding configuration.
    """
    id: int

    step2_about_me: bool
    step2_address: bool
    step2_birthdate: bool

    step3_about_me: bool
    step3_address: bool
    step3_birthdate: bool
