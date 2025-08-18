from sqlalchemy import Column, Integer, String, ForeignKey, Text, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum
import pytz
from .database import Base

IST = pytz.timezone("Asia/Kolkata")

def ist_now():
    return datetime.now(IST)


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="User")  # "User", "Agent", "Admin"
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    tickets = relationship("Ticket", back_populates="user")


class TicketType(str, enum.Enum):
    service = "Service"
    asset = "Asset"


class TicketPriority(str, enum.Enum):
    low = "Low"
    medium = "Medium"
    high = "High"


class TicketStatus(str, enum.Enum):
    created = "Created"
    assigned = "Assigned"
    reopened = "Reopened"
    in_progress = "In Progress"
    resolved = "Resolved"
    closed = "Closed"
    not_resolved = "Not Resolved"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    created_by = Column(String(50), nullable=False)

    type = Column(Enum(TicketType), nullable=False)
    category = Column(String(100), nullable=False)   # ✅ changed from Enum to String
    priority = Column(Enum(TicketPriority), nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.created)

    created_at = Column(TIMESTAMP(timezone=True), default=ist_now)

    user_id = Column(Integer, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="tickets")
