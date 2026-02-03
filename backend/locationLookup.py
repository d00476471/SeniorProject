import pandas as pd
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import requests

df = pd.read_csv('airports.csv')
df_major = df[df['iata'].str.match(r'^[A-Z]{3}$', na=False)].copy()

def getDrivingDestinations(startLocation: str):
    geolocator = Nominatim(user_agent="travelApp")

    location = geolocator.geocode(startLocation)
    if not location:
        return []
    
    startLat = location.latitude
    startLon = location.longitude

    radiusKm = 300

    username = "dasj31" 
    url = "http://api.geonames.org/findNearbyPlaceNameJSON"

    params = {
        "lat": startLat,
        "lng": startLon,
        "radius": radiusKm,
        "cities": "cities15000",
        "maxRows": 200,
        "username": username
    }

    response = requests.get(url, params=params).json()

    drivingDestinations = []

    if "geonames" in response:
        for city in response["geonames"]:

            # get distance from start city 
            city_coords = (city['lat'], city['lng'])
            start_coords = (startLat, startLon)
            dist = geodesic(start_coords, city_coords).kilometers
            
            # dont show cities that are too close and check that they are within the radius
            if 100 < dist <= radiusKm:
                drivingDestinations.append({
                    "city_name": city["name"],
                    "country": city["countryName"],
                    "distance_km": round(dist),
                    "drive_time_hours": round(dist / 105, 1),
                    "transport_mode": "car"
                })

    return drivingDestinations

def getNearestAirport(cityName):
    geolocator = Nominatim(user_agent="travelApp")
    
    location = geolocator.geocode(cityName)
    
    if not location:
        print(f"Could not find city: {cityName}")
        return None
    
    userCoords = (location.latitude, location.longitude)
    
    def calculate_distance(row):
        airportCoords = (row['latitude'], row['longitude'])
        return geodesic(userCoords, airportCoords).miles

    df_major['distance'] = df_major.apply(calculate_distance, axis=1)
    
    nearestAirport = df_major.loc[df_major['distance'].idxmin()]
    
    print(f"Nearest airport to {cityName} is {nearestAirport['name']} ({nearestAirport['iata']}) - {nearestAirport['distance']:.1f} miles away")

    return nearestAirport['iata']

def removeBadAirport(iata):
    
    global df_major

    df_major = df_major[df_major['iata'] != iata]

    try:
        full_df = pd.read_csv('airports.csv')
        full_df = full_df[full_df['iata'] != iata]
        full_df.to_csv('airports.csv', index=False)
        print("airports.csv updated.")
    except Exception as e:
        print(f"Failed to update CSV: {e}")
