# Use official Python image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements first for caching layers
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set environment variables (Prevent Python from buffering logs)
ENV PYTHONUNBUFFERED=1

# Expose the FastAPI default port
EXPOSE 8000

# Run the FastAPI app with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
