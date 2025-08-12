from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth_utils, database

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = auth_utils.hash_password(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_pw,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 2️⃣ Verify password
    try:
        password_valid = auth_utils.verify_password(user.password, db_user.password_hash)
    except Exception as e:
        print("Password verification error:", e)
        raise HTTPException(status_code=500, detail="Password verification failed")

    if not password_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3️⃣ Create JWT token
    try:
        access_token = auth_utils.create_access_token(
            data={"sub": str(db_user.user_id)}
        )
    except Exception as e:
        print("Token creation error:", e)
        raise HTTPException(status_code=500, detail="Token generation failed")

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
