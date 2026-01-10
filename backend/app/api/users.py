from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models.user import User
from app.schemas.user import (
    UserStartRequest,
    UserStep2Request,
    UserStep3Request,
    UserRead,
)
from app.security import hash_password


router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/start", response_model=UserRead)
def start_onboarding(
    payload: UserStartRequest,
    session: Session = Depends(get_session),
):
    """
    POST /api/users/start

    - Method: POST (we are CREATING a new user)
    - Body: { "email": "...", "password": "..." }

    Steps:
    1. Check if email already used
    2. Hash the password
    3. Create and save the user
    4. Return safe user data (without password)
    """
    # 1) Check if email already exists
    existing = session.exec(
        select(User).where(User.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered.",
        )

    # 2) Hash password
    hashed = hash_password(payload.password)

    # 3) Create user
    user = User(
        email=payload.email,
        password=hashed,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user  # FastAPI will convert to UserRead


@router.post("/{user_id}/step2", response_model=UserRead)
def save_step2(
    user_id: int,
    payload: UserStep2Request,
    session: Session = Depends(get_session),
    
):
    """
    POST /api/users/{user_id}/step2

    - Method: POST (we are UPDATING user info)
    - Body: about_me, address fields

    Updates:
    - about_me
    - street, city, state, zip
    - sets step2_completed = True
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update fields if provided
    if payload.about_me is not None:
        user.about_me = payload.about_me

    if payload.street is not None:
        user.street = payload.street
    if payload.city is not None:
        user.city = payload.city
    if payload.state is not None:
        user.state = payload.state
    if payload.zip is not None:
        user.zip = payload.zip
    if payload.birthdate is not None:
        user.birthdate = payload.birthdate


    user.step2_completed = True

    session.add(user)
    session.commit()
    session.refresh(user)

    return user



@router.post("/{user_id}/step3")
def save_step3(user_id: int, payload: UserStep3Request, session: Session = Depends(get_session)):
    user = session.get(User, user_id)

    """
    POST /api/users/{user_id}/step3

    - Method: POST (we are UPDATING user info)
    - Body: birthdate

    Updates:
    - birthdate
    - sets step3_completed = True
    """
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ update ONLY if provided
    if payload.about_me is not None and payload.about_me != "":
        user.about_me = payload.about_me

    if payload.street is not None and payload.street != "":
        user.street = payload.street
    if payload.city is not None and payload.city != "":
        user.city = payload.city
    if payload.state is not None and payload.state != "":
        user.state = payload.state
    if payload.zip is not None and payload.zip != "":
        user.zip = payload.zip

    if payload.birthdate is not None:
        user.birthdate = payload.birthdate

    user.step3_completed = True

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("", response_model=List[UserRead])
def list_users(session: Session = Depends(get_session)):
    """
    GET /api/users

    - Method: GET (we are READING data)
    - Returns a list of all users (without passwords).
    """
    users = session.exec(select(User).order_by(User.created_at)).all()
    return users






