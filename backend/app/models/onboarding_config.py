from typing import Optional

from sqlmodel import SQLModel, Field


class OnboardingConfig(SQLModel, table=True):
    """
    Controls which components appear on steps 2 and 3 of the onboarding wizard.

    We model this as simple boolean flags for each component on each step.
    """

    id: Optional[int] = Field(default=None, primary_key=True)

    # Step 2 component toggles
    step2_about_me: bool = Field(default=True)
    step2_address: bool = Field(default=False)
    step2_birthdate: bool = Field(default=False)

    # Step 3 component toggles
    step3_about_me: bool = Field(default=False)
    step3_address: bool = Field(default=True)
    step3_birthdate: bool = Field(default=False)
