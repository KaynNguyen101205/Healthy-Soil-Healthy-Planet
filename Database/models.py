from sqlalchemy import Column, Integer, String, Text
from database import Base

class SeaAnimalDeaths(Base):
    __tablename__ = "sea_animal_deaths"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, index=True)
    animal_type = Column(String, index=True)
    cause_of_death = Column(Text)
    death_count = Column(Integer)
