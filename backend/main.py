import uvicorn
import flightLookup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

flight_results = []

def flight_search(destination: str, max_price: int, date: int):
    print(f"Looking for flights to {destination} under ${max_price}")
    results = flightLookup.lookupRequest(destination, max_price, date)
    flight_results.clear()
    flight_results.extend(results)

class Request(BaseModel):
    location: str
    budget: int
    date: int

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

temp_db = []

@app.get(path="/requests")
def get_requests():
    return flight_results

@app.post(path="/requests", response_model=Request)
def add_request(req: Request):
    temp_db.append(req)
    #When we get information from the user we can call my search apis
    flight_search(req.location, req.budget, req.date)
    return req

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)