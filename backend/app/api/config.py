from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from app.db import get_session
from app.models.onboarding_config import OnboardingConfig
from app.schemas.config import OnboardingConfigUpdate, OnboardingConfigRead


router = APIRouter(prefix="/api/config", tags=["config"])


def _get_or_create_config(session: Session) -> OnboardingConfig:
    """
    Helper that always returns a config row.
    If none exists, it creates a default one.
    """
    config = session.exec(select(OnboardingConfig)).first()
    if not config:
        config = OnboardingConfig()  # uses model defaults
        session.add(config)
        session.commit()
        session.refresh(config)
    return config


@router.get("", response_model=OnboardingConfigRead)
def get_config(session: Session = Depends(get_session)):
    """
    GET /api/config

    - Method: GET (we are READING configuration)
    """
    config = _get_or_create_config(session)
    return config


@router.post("", response_model=OnboardingConfigRead)
def update_config(
    payload: OnboardingConfigUpdate,
    session: Session = Depends(get_session),
):
    """
    POST /api/config

    - Method: POST (we are UPDATING / SAVING config)
    - Body: any subset of the boolean flags
    """
    config = _get_or_create_config(session)

    # Only update fields that were provided
    if payload.step2_about_me is not None:
        config.step2_about_me = payload.step2_about_me
    if payload.step2_address is not None:
        config.step2_address = payload.step2_address
    if payload.step2_birthdate is not None:
        config.step2_birthdate = payload.step2_birthdate

    if payload.step3_about_me is not None:
        config.step3_about_me = payload.step3_about_me
    if payload.step3_address is not None:
        config.step3_address = payload.step3_address
    if payload.step3_birthdate is not None:
        config.step3_birthdate = payload.step3_birthdate

    session.add(config)
    session.commit()
    session.refresh(config)

    return config
