from app.database import engine, Base
from app.models import Ticket  # import only Ticket model

# Drop only tickets table
Ticket.__table__.drop(bind=engine, checkfirst=True)

# Recreate tickets table with updated schema
Ticket.__table__.create(bind=engine, checkfirst=True)

print("✅ Tickets table reset successfully")
