from sqlalchemy.orm import Session
from . import models, schemas


def create_ticket(db: Session, ticket: schemas.TicketCreate, user_id: int, username: str):
    db_ticket = models.Ticket(
        title=ticket.title,
        description=ticket.description,
        type= ticket.type,
        category=ticket.category,
        priority=ticket.priority,
        created_by=username,
        user_id=user_id
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def get_tickets_by_user(db: Session, user_id: int):
    return db.query(models.Ticket).filter(models.Ticket.user_id == user_id).all()
