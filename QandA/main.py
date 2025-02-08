from fastapi import FastAPI, Depends, HTTPException, Query
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
    upvotes = Column(Integer, default=0) 

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
    upvotes: int = 0
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
@app.get("/questions/")
def get_questions(db: Session = Depends(get_db)):
    try:
        # Explicitly sort by upvotes in descending order
        questions = db.query(Question).order_by(Question.upvotes.desc(), Question.id.asc()).all()
        return questions
    except Exception as e:
        print(f"Error retrieving questions: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

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
@app.post("/questions/{question_id}/upvote/")
def upvote_answer(question_id: int, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    question.upvotes = question.upvotes + 1 if question.upvotes else 1  # Fix possible NoneType error
    db.commit()
    db.refresh(question)

    return {"message": "Upvote successful", "upvotes": question.upvotes}
@app.get("/search/")
def search_questions(query: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    results = db.query(Question).filter(Question.question_text.ilike(f"%{query}%")).order_by(Question.upvotes.desc()).all()

    if not results:
        return []  # ✅ Return empty list instead of error

    return results