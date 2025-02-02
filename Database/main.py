from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API: Fetch all records
@app.get("/sea-animal-deaths/")
def get_sea_animal_deaths(db: Session = Depends(get_db)):
    return db.query(models.SeaAnimalDeaths).all()

# API: Fetch data filtered by year
@app.get("/sea-animal-deaths/{year}")
def get_sea_animal_deaths_by_year(year: int, db: Session = Depends(get_db)):
    return db.query(models.SeaAnimalDeaths).filter(models.SeaAnimalDeaths.year == year).all()
