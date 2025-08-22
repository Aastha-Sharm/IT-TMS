from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException, status


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


def update_ticket(db: Session, ticket_id: int, ticket_update: schemas.TicketUpdate, user_id: int):
    db_ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id,
        models.Ticket.user_id == user_id
    ).first()

    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    # Update fields only if provided
    if ticket_update.title is not None:
        db_ticket.title = ticket_update.title
    if ticket_update.description is not None:
        db_ticket.description = ticket_update.description
    if ticket_update.type is not None:
        db_ticket.type = ticket_update.type
    if ticket_update.category is not None:
        db_ticket.category = ticket_update.category
    if ticket_update.priority is not None:
        db_ticket.priority = ticket_update.priority
    if ticket_update.status is not None:
        db_ticket.status = ticket_update.status

    db.commit()
    db.refresh(db_ticket)
    return db_ticket


def delete_ticket(db: Session, ticket_id: int, user_id: int):
    db_ticket = db.query(models.Ticket).filter(
        models.Ticket.id == ticket_id,
        models.Ticket.user_id == user_id
    ).first()

    if not db_ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    db.delete(db_ticket)
    db.commit()
    return {"detail": "Ticket deleted successfully"}