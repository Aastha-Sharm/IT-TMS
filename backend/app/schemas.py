from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "User"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TicketCategory(str, Enum):
    service_request = "Service Request"
    asset_request = "Asset Request"


class TicketPriority(str, Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class TicketStatus(str, Enum):
    created = "Created"
    assigned = "Assigned"
    reopened = "Reopened"
    in_progress = "In Progress"
    resolved = "Resolved"
    closed = "Closed"
    not_resolved = "Not Resolved"


class TicketBase(BaseModel):
    title: str
    description: str
    category: TicketCategory
    priority: TicketPriority


class TicketCreate(TicketBase):
    pass


class TicketResponse(TicketBase):
    id: int
    created_by: str
    status: TicketStatus
    created_at: datetime

    class Config:
        orm_mode = True