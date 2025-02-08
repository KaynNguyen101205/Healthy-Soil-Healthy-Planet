from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Database Setup
DATABASE_URL = "postgresql://namkhanh101205hi:namkhanh101205@localhost/qanda_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# ✅ Define the Question Model
class QuestionCreate(BaseModel):
    question_text: str

# ✅ Create the table
Base.metadata.create_all(bind=engine)

# ✅ Database Dependency
class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=True)  # ✅ Allow storing answers

Base.metadata.create_all(bind=engine)  # ✅ Ensure table is created

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ API Routes
@app.post("/questions/")
def create_question(question: QuestionCreate, db: Session = Depends(get_db)):
    new_question = Question(question_text=question.question_text)
    db.add(new_question)
    db.commit()
    db.refresh(new_question)
    return new_question

@app.get("/questions/")
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()

@app.post("/answers/{question_id}")
def answer_question(question_id: int, answer: str, db: Session = Depends(get_db)):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    question.answer_text = answer
    db.commit()
    return {"message": "Answer added!"}

