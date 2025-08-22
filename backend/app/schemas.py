from pydantic import BaseModel, EmailStr, validator
from typing import Optional, Union
from datetime import datetime
from enum import Enum


# ===========================
# User Schemas
# ===========================

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "User"


class UserLogin(BaseModel):
    email: EmailStr
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


# ===========================
# Ticket Schemas
# ===========================

class TicketType(str, Enum):
    service = "Service"
    asset = "Asset"


class ServiceCategory(str, Enum):
    network_issue = "Network Issue"
    software_installation = "Software Installation"
    email_support = "Email Support"


class AssetCategory(str, Enum):
    laptop = "Laptop"
    printer = "Printer"
    mobile_device = "Mobile Device"


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
    type: TicketType
    category: str   # accept string, validate later
    priority: TicketPriority
    title: str
    description: str

    # normalize input (case-insensitive, strip spaces)
    @validator("type", "category", "priority", pre=True)
    def normalize_enum(cls, v):
        if isinstance(v, str):
            return v.strip().title()
        return v


class TicketCreate(TicketBase):
    pass


class TicketResponse(BaseModel):
    id: int
    title: str
    description: str
    created_by: str
    type: TicketType
    category: str   # <-- keep as plain string (can be service or asset category)
    priority: TicketPriority
    status: TicketStatus
    created_at: datetime

    class Config:
        orm_mode = True



class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None