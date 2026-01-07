import bcrypt


def hash_password(plain_password: str) -> str:
    """
    Takes a plain password and returns a bcrypt hash.
    """
    password_bytes = plain_password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compares a plain password with a stored bcrypt hash.
    Returns True if they match.
    """
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )
