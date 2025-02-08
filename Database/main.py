from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import pandas as pd
from typing import List
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow frontend to access backend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Database Configuration
DATABASE_URL = "postgresql://namkhanh101205hi:namkhanh101205@localhost/erosion_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Erosion Data Table
class ErosionData(Base):
    __tablename__ = "erosion_data"
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    erosion_cause = Column(String, nullable=False)
    erosion_rate = Column(Float, nullable=False)

class ErosionDataSchema(BaseModel):
    id: int
    year: int
    location: str
    erosion_cause: str
    erosion_rate: float

    class Config:
        orm_mode = True

# Create the Table
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.get("/erosion-data/", response_model=List[ErosionDataSchema])
def get_erosion_data(db: Session = Depends(get_db)):
    return db.query(ErosionData).all()

@app.post("/erosion-data/")
def add_erosion_data(year: int, location: str, erosion_cause: str, erosion_rate: float, db: Session = Depends(get_db)):
    new_entry = ErosionData(year=year, location=location, erosion_cause=erosion_cause, erosion_rate=erosion_rate)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

# Run the bulk insert after starting the server (optional)
def bulk_insert_erosion_data():
    csv_path = "/var/lib/postgresql/erosion_data.csv"
    df = pd.read_csv(csv_path)
    db = SessionLocal()
    try:
        for _, row in df.iterrows():
            entry = ErosionData(
                year=row["year"],
                location=row["location"],
                erosion_cause=row["erosion_cause"],
                erosion_rate=row["erosion_rate"]
            )
            db.add(entry)
        db.commit()
    finally:
        db.close()

bulk_insert_erosion_data()
