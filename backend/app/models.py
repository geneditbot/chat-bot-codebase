from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(String(36), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    original_lesson = Column(Text)
    updated_lesson = Column(Text)
    summary = Column(Text)  # New field for summarized history

class Message(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(36), ForeignKey("chat_sessions.id"))
    role = Column(String(10))
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)