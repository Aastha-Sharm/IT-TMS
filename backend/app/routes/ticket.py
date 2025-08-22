from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, crud, database, models
from ..auth_utils import get_current_user  # JWT auth dependency

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"]
)


@router.post("/", response_model=schemas.TicketResponse)
def create_new_ticket(
    ticket: schemas.TicketCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_ticket(db, ticket, current_user.user_id, current_user.username)


@router.get("/", response_model=list[schemas.TicketResponse])
def get_my_tickets(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.get_tickets_by_user(db, current_user.user_id)

@router.put("/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(ticket_id: int, ticket_update: schemas.TicketUpdate, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    return crud.update_ticket(db, ticket_id, ticket_update, current_user.user_id)


@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(database.get_db), current_user: int = Depends(get_current_user)):
    return crud.delete_ticket(db, ticket_id, current_user.user_id)

