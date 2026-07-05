import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai

from prompts import SYSTEM_PROMPT

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

conversation_memory = []

class ChatRequest(BaseModel):
    message: str


@app.get("/")
def root():
    return {"message": "Psychological Insight Assistant API Running"}


@app.post("/chat")
def chat(request: ChatRequest):

    global conversation_memory

    conversation_memory.append(
        {
            "role": "user",
            "content": request.message
        }
    )

    history = "\n".join(
        [
            f"{msg['role']}: {msg['content']}"
            for msg in conversation_memory[-20:]
        ]
    )
    prompt = f"""
{SYSTEM_PROMPT}

Conversation History:

{history}

Respond to the latest user message.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    ai_reply = response.text

    ai_reply = (
    ai_reply.replace("##", "")
            .replace("***", "")
            .replace("**", "")
    )

    conversation_memory.append(
        {
            "role": "assistant",
            "content": ai_reply
        }
    )

    return {
        "response": ai_reply
    }