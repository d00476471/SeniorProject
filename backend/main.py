import uvicorn
import flightLookup
import locationLookup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

flightResults = []
driveResults = []

def flightSearch(destination: str, max_price: int, depart: int, ret: int):
    print(f"Looking for flights from {destination} under ${max_price}")
    airportCode = locationLookup.getNearestAirport(destination)
    results = flightLookup.lookupRequest(airportCode, max_price, depart, ret)
    flightResults.clear()
    flightResults.extend(results)

def driveSearch(destination: str):
    print(f"Looking for drives from {destination}")
    results = locationLookup.getDrivingDestinations(destination)
    driveResults.clear()
    driveResults.extend(results)


class Request(BaseModel):
    location: str
    budget: int
    depart: int
    ret: int

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

@app.get(path="/flights")
def get_flights():
    print(flightResults)
    return flightResults

@app.get(path="/drives")
def get_drives():
    print(driveResults)
    return driveResults

@app.post(path="/requests", response_model=Request)
def add_request(req: Request):
    temp_db.append(req)
    # when we get information from the user we can call my search apis
    driveSearch(req.location)
    flightSearch(req.location, req.budget, req.depart, req.ret)
    return req

if __name__ == "__main__":
    #flightSearch("St. George", 2000, 20260202, 20260209)
    #driveSearch("St. George")
    uvicorn.run(app, host="0.0.0.0", port=8000)