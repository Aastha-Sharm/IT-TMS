from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routes import auth 

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="IT-TMS Backend")

# Include authentication routes
app.include_router(auth.router, tags=["Authentication"])
