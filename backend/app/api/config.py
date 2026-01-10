from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models.onboarding_config import OnboardingConfig
from app.schemas.config import OnboardingConfigRead, OnboardingConfigUpdate

router = APIRouter(prefix="/api/config", tags=["config"])


def _validate_config(cfg: OnboardingConfigUpdate) -> None:
    step2_count = (
        (1 if cfg.step2_about_me else 0)
        + (1 if cfg.step2_address else 0)
        + (1 if cfg.step2_birthdate else 0)
    )
    step3_count = (
        (1 if cfg.step3_about_me else 0)
        + (1 if cfg.step3_address else 0)
        + (1 if cfg.step3_birthdate else 0)
    )

    if step2_count < 1:
        raise HTTPException(
            status_code=400,
            detail="Invalid config: Step 2 must have at least one component enabled.",
        )
    if step3_count < 1:
        raise HTTPException(
            status_code=400,
            detail="Invalid config: Step 3 must have at least one component enabled.",
        )


def _get_or_create_singleton_config(session: Session) -> OnboardingConfig:
    """
    We treat config as a singleton row in DB (one row only).
    If it doesn't exist yet, create a default valid config.
    """
    cfg = session.exec(select(OnboardingConfig)).first()
    if cfg:
        return cfg

    cfg = OnboardingConfig(
        # ✅ default valid setup
        step2_about_me=True,
        step2_address=False,
        step2_birthdate=False,
        step3_about_me=False,
        step3_address=True,
        step3_birthdate=False,
    )

    session.add(cfg)
    session.commit()
    session.refresh(cfg)
    return cfg


@router.get("", response_model=OnboardingConfigRead)
def get_config(session: Session = Depends(get_session)):
    cfg = _get_or_create_singleton_config(session)
    return cfg


@router.post("", response_model=OnboardingConfigRead)
def update_config(payload: OnboardingConfigUpdate, session: Session = Depends(get_session)):
    # ✅ backend rule enforcement (locked door)
    _validate_config(payload)

    cfg = _get_or_create_singleton_config(session)

    # Update fields
    cfg.step2_about_me = payload.step2_about_me
    cfg.step2_address = payload.step2_address
    cfg.step2_birthdate = payload.step2_birthdate

    cfg.step3_about_me = payload.step3_about_me
    cfg.step3_address = payload.step3_address
    cfg.step3_birthdate = payload.step3_birthdate

    session.add(cfg)
    session.commit()
    session.refresh(cfg)
    return cfg
