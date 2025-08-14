from fastapi import FastAPI
from app.database import engine, Base
from app import models
from app.routes import auth, ticket
from fastapi.middleware.cors import CORSMiddleware



models.Base.metadata.create_all(bind=engine)


app = FastAPI(title="IT-TMS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, tags=["Authentication"])
app.include_router(ticket.router, tags=["Tickets"])


@app.get("/")
def root():
    return {"message": "Welcome to the Ticketing System API"}