from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum, TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)   # PK
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="User")  # "User", "Agent", "Admin"
    created_at = Column(TIMESTAMP, server_default=func.now())

    tickets = relationship("Ticket", back_populates="user")



class TicketCategory(str, enum.Enum):
    service_request = "Service Request"
    asset_request = "Asset Request"


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
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_by = Column(String, nullable=False)
    category = Column(Enum(TicketCategory), nullable=False)
    priority = Column(Enum(TicketPriority), nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.created)
    created_at = Column(DateTime, default=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.user_id"))

    user = relationship("User", back_populates="tickets")
