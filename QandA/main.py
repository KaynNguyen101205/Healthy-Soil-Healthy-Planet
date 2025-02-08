from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional 

app = FastAPI()

# Enable CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration
DATABASE_URL = "postgresql://namkhanh101205hi:namkhanh101205@localhost/qanda_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Question Table
class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)  # ✅ Ensure username is stored
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=True)

# Create the table
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Pydantic Model for Validation
class QuestionCreate(BaseModel):
    username: str
    question_text: str

class AnswerCreate(BaseModel):
    answer_text: str

class QuestionResponse(BaseModel):
    id: int
    username: str
    question_text: str
    answer_text: Optional[str] = None
    class Config:
        orm_mode = True

# ✅ Store question with username
@app.post("/questions/", response_model=QuestionResponse)
def add_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = Question(username=question.username, question_text=question.question_text)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

# ✅ Fetch all questions including usernames
@app.get("/questions/", response_model=List[QuestionResponse])
def get_questions(db: Session = Depends(get_db)):
    questions = db.query(Question).all()
    for q in questions:
        if q.answer_text is None:
            q.answer_text = ""  # ✅ Convert None to an empty string
    return questions

@app.post("/answers/{question_id}")
def answer_question(question_id: int, answer: AnswerCreate, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    question.answer_text = answer.answer_text
    db.commit()
    return {"message": "Answer added!"}
@app.post("/questions/")
def submit_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = Question(username=question.username, question_text=question.question_text)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question