from .models import Base  
from .db import engine  #SQLAlchemy engine

def init_db():
    # This will create all tables if they don't already exist
    print("Initializing DB...")
    Base.metadata.create_all(bind=engine)
    print("DB tables created (if not exists)")