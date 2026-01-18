import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class Request(BaseModel):
    location: str
    budget: int
    date: int

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

temp_db = []

@app.get(path="/requests", response_model=List[Request])
def get_requests():
    return temp_db

@app.post(path="/requests", response_model=Request)
def add_request(req: Request):
    temp_db.append(req)
    return req

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)