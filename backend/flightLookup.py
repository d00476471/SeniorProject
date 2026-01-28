import os
import json
import requests
api_key = os.getenv('SERPAPI_API_KEY')

def lookupRequest(destination: str, max_price: int, depart: int, ret: int):
    depart_str = str(depart)
    ret_str = str(ret)
    # format date from int into string that can be fed into api search
    formatted_depart = f"{depart_str[:4]}-{depart_str[4:6]}-{depart_str[6:8]}"
    formatted_ret = f"{ret_str[:4]}-{ret_str[4:6]}-{ret_str[6:8]}"

    params = {
        "api_key": api_key,
        "engine": "google_travel_explore", 
        "departure_id": destination, 
        "max_price": max_price,
        "outbound_date": formatted_depart,
        "return_date": formatted_ret,
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
                    #Can give desination image i might use in the future
                    #"image": item.get("thumbnail"),
                    "airline": item.get("airline"),
                    "duration_minutes": item.get("flight_duration"),
                    "stops": item.get("number_of_stops") 
                }
                flight_results.append(destination)
                    
    return flight_results


