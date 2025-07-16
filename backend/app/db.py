from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'edi_chatbot_local')
DB_USER = os.getenv('DB_USER', 'edi_chatbot_user')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'local')
DB_PORT = os.getenv('DB_PORT', '3306')

DATABASE_URL = f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

