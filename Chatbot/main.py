from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Get API key from .env file
BARD_API_KEY = os.getenv("BARD_API_KEY")
if not BARD_API_KEY:
    raise ValueError("BARD_API_KEY is missing. Please check your .env file.")

# FastAPI app instance
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific origins for better security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class ChatRequest(BaseModel):
    question: str

# Function to fetch response from Bard (Gemini API)
def get_bard_response(question: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key={BARD_API_KEY}"
    headers = {"Content-Type": "application/json"}
    data = {"contents": [{"parts": [{"text": question}]}]}

    try:
        response = requests.post(url, json=data, headers=headers)
        response.raise_for_status()
        result = response.json()

        if "candidates" in result and len(result["candidates"]) > 0:
            return result["candidates"][0]["content"]["parts"][0]["text"]

        return "No response received from Bard."

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API Error: {str(e)}")

@app.get("/")
def root():
    return {"message": "Chatbot API is running. Use POST /chat/ to interact."}

# API endpoint for chatbot responses
@app.post("/chat/")
def chatbot_response(request: ChatRequest):
    user_question = request.question.strip()

    try:
        bot_response = get_bard_response(user_question)
        return {"response": bot_response}
    except HTTPException as e:
        return {"error": e.detail}