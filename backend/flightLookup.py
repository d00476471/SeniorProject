import os
import json
import requests
api_key = os.getenv('SERPAPI_API_KEY')

def lookupRequest(destination: str, max_price: int, date: int):
    date_str = str(date)
    #Format date from int into string that can be fed into api search
    formatted_date = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"

    params = {
        "api_key": api_key,
        "engine": "google_travel_explore", 
        "departure_id": destination, 
        "max_price": max_price,
        "outbound_date": formatted_date,
    }
    
    search = requests.get("https://serpapi.com/search", params=params)
    response = search.json()

    flight_results = []

    if "destinations" in response:
            for item in response["destinations"]:
                destination = {
                    "city_name": item.get("name"),
                    "country": item.get("country"),
                    "price": item.get("flight_price"),
                    #Can give desination image data i might use in the future
                    #"image": item.get("thumbnail"),
                    "airline": item.get("airline"),
                    "duration_minutes": item.get("flight_duration"),
                    "stops": item.get("number_of_stops") 
                }
                print(destination)
                flight_results.append(destination)
                    
    return flight_results


