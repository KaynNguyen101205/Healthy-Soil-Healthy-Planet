from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Use 'host.docker.internal' if PostgreSQL is running on the host machine
DATABASE_URL = "postgresql://namkhanh101205:namkhanh101205@127.0.0.1/ocean_db"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
