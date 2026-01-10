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




class OnboardingConfigBase(SQLModel):
    # Step 2 components
    step2_about_me: bool = True
    step2_address: bool = False
    step2_birthdate: bool = False

    # Step 3 components
    step3_about_me: bool = False
    step3_address: bool = True
    step3_birthdate: bool = False


class OnboardingConfigRead(OnboardingConfigBase):
    id: int




