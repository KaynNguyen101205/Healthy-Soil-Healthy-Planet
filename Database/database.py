from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database connection URL (Update with your actual PostgreSQL credentials)
DATABASE_URL = "postgresql://namkhanh101205:namkhanh101205@localhost/ocean_db"

# Create a database engine
engine = create_engine(DATABASE_URL)

# Create a session for database operations
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for defining models
Base = declarative_base()
