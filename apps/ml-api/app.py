from flask import Flask,request,jsonify
import xgboost as xgb
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import pandas as pd
from huggingface_hub import hf_hub_download
import geopandas as gpd
import networkx as nx
from shapely.geometry import Point, LineString
import requests
from flask_cors import CORS
from dotenv import load_dotenv
import os
import osmnx as ox
from datetime import datetime
load_dotenv()
app=Flask(__name__)
CORS(app, supports_credentials=True, allow_headers=['Content-Type', 'Authorization', 'X-XSRF-TOKEN'])
import joblib
max_volume=7280
from pathlib import Path
model_path = hf_hub_download(repo_id="zzzzakaria/traffic-volume-predictor", filename="traffic_volume_model.joblib")
model = joblib.load(model_path)
G = ox.graph_from_place("Marrakech, Morocco", network_type="all")
print("loading graph edges and nodes ......")
    # Load   (streets)
edges = gpd.read_file("marrakech_streets.gpkg", layer="edges")
    # Load   (intersections)
nodes = gpd.read_file("marrakech_streets.gpkg", layer="nodes")




# Input exemple :
# origin_point = (31.6643, -8.0500)          
# destination_point = (31.6258, -7.9892) 
def Find_Shortest_Path_Distance(origin_point,destination_point):

    print(os.path.exists('marrakech_streets.gpkg'))
    # graph
    print("here we go")
    #  first rows
    # print(edges.head())
    # print(nodes.head())
    # Trouver les nœuds les plus proches
    origin_node = ox.distance.nearest_nodes(G, X=origin_point[1], Y=origin_point[0])
    destination_node = ox.distance.nearest_nodes(G, X=destination_point[1], Y=destination_point[0])

    print(f'start: {origin_node} /n the destination: {destination_node}')
    if not nx.has_path(G, origin_node, destination_node):
        print("Les deux nœuds ne sont pas connectés !")
        #here we gonna use Map API

    else:
        print(f'les deux points sont accessible')
        #  plus court chemin  de la distance
        shortest_path = nx.astar_path(G, source=origin_node, target=destination_node, weight='length')
        #print("shortest_path is :",shortest_path)
        # Tracer le graphe 
        fig, ax = ox.plot_graph_route(G, shortest_path, route_linewidth=3, node_size=5, edge_linewidth=0.1)

    route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in shortest_path]
    distance = nx.astar_path_length(G, origin_node, destination_node)
    # print("distance tfooo:",distance/10)

    response=[
        {"route":route_coords},
        {"distance":distance/10} #km
    ]
    return response
def predictVolumefile(distance, data):
    response = fetchweather()
    now = datetime.now()
    temp = response["main"]["temp"]
    rain_1h = response.get("rain", {}).get("1h", 0.0)
    snow_1h = response.get("snow", {}).get("1h", 0.0)
    clouds_all = response["clouds"]["all"]
    weather_description = response["weather"][0]["description"].lower()
    weather_flags = {
        "Clouds": "clouds" in weather_description,
        "Drizzle": "drizzle" in weather_description,
        "Fog": "fog" in weather_description,
        "Haze": "haze" in weather_description,
        "Mist": "mist" in weather_description,
        "Rain": "rain" in weather_description,
        "Smoke": "smoke" in weather_description,
        "Snow": "snow" in weather_description,
        "Squall": "squall" in weather_description,
        "Thunderstorm": "thunderstorm" in weather_description
    }
    all_weather_descriptions = [
        "Sky is Clear", "broken clouds", "drizzle", "few clouds", "fog",
        "freezing rain", "haze", "heavy intensity drizzle", "heavy intensity rain", "heavy snow",
        "light intensity drizzle", "light intensity shower rain", "light rain", "light rain and snow",
        "light shower snow", "light snow", "mist", "moderate rain", "overcast clouds",
        "proximity shower rain", "proximity thunderstorm", "proximity thunderstorm with drizzle",
        "proximity thunderstorm with rain", "scattered clouds", "shower drizzle", "shower snow",
        "sky is clear", "sleet", "smoke", "snow", "thunderstorm", "thunderstorm with drizzle",
        "thunderstorm with heavy rain", "thunderstorm with light drizzle", "thunderstorm with light rain",
        "thunderstorm with rain", "very heavy rain"
    ]
    sample = pd.DataFrame({
        'temp': [temp-273.15],
        'rain_1h': [rain_1h],
        'snow_1h': [snow_1h],
        'clouds_all': [clouds_all],
        'hour': [now.hour],
        'day_of_week': [now.weekday()],
        'month': [now.month],
        'is_holiday': [0],
        **{f"weather_main_{k}": [v] for k, v in weather_flags.items()},
        **{f"weather_description_{desc}": [desc.lower() in weather_description] for desc in all_weather_descriptions},
        'traffic_volume_lag1': [1800.0],
        'traffic_volume_lag2': [1700.0],
        'year': [now.year],
        'day_of_month': [now.day],
    }, index=[pd.to_datetime('2018-10-02 14:00:00')])
    for col in [
        'weather_main_Clouds', 'weather_main_Drizzle', 'weather_main_Fog',
        'weather_main_Haze', 'weather_main_Mist', 'weather_main_Rain',
        'weather_main_Smoke', 'weather_main_Snow', 'weather_main_Squall',
        'weather_main_Thunderstorm'
    ]:
        if col not in sample.columns:
            sample[col] = [False]

    for desc in all_weather_descriptions:
        col = f'weather_description_{desc}'
        if col not in sample.columns:
            sample[col] = [False]
    sample = sample.reindex(columns=[
        'temp', 'rain_1h', 'snow_1h', 'clouds_all', 'hour', 'day_of_week', 'month', 'is_holiday',
        'weather_main_Clouds', 'weather_main_Drizzle', 'weather_main_Fog', 'weather_main_Haze',
        'weather_main_Mist', 'weather_main_Rain', 'weather_main_Smoke', 'weather_main_Snow',
        'weather_main_Squall', 'weather_main_Thunderstorm',
        'weather_description_Sky is Clear', 'weather_description_broken clouds',
        'weather_description_drizzle', 'weather_description_few clouds', 'weather_description_fog',
        'weather_description_freezing rain', 'weather_description_haze',
        'weather_description_heavy intensity drizzle', 'weather_description_heavy intensity rain',
        'weather_description_heavy snow', 'weather_description_light intensity drizzle',
        'weather_description_light intensity shower rain', 'weather_description_light rain',
        'weather_description_light rain and snow', 'weather_description_light shower snow',
        'weather_description_light snow', 'weather_description_mist',
        'weather_description_moderate rain', 'weather_description_overcast clouds',
        'weather_description_proximity shower rain', 'weather_description_proximity thunderstorm',
        'weather_description_proximity thunderstorm with drizzle',
        'weather_description_proximity thunderstorm with rain',
        'weather_description_scattered clouds', 'weather_description_shower drizzle',
        'weather_description_shower snow', 'weather_description_sky is clear',
        'weather_description_sleet', 'weather_description_smoke', 'weather_description_snow',
        'weather_description_thunderstorm', 'weather_description_thunderstorm with drizzle',
        'weather_description_thunderstorm with heavy rain',
        'weather_description_thunderstorm with light drizzle',
        'weather_description_thunderstorm with light rain',
        'weather_description_thunderstorm with rain', 'weather_description_very heavy rain',
        'traffic_volume_lag1', 'traffic_volume_lag2', 'year', 'day_of_month'
    ])
    print(distance)
    prediction = adjust_volume_by_distance_and_width(model.predict(sample) * max_volume, distance, 0.0086)
    return prediction






def adjust_volume_by_distance_and_width(predicted_volume, my_road_km, my_road_width):
    """
    Adjust predicted traffic volume based on both distance and road width.

    Args:
        predicted_volume (float): Volume predicted by the model.
        my_road_km (float): Length of the target road in kilometers.
        highway_km (float): Length of the highway the model was trained on.
        my_road_width (float): Width of your road in meters.
        highway_width (float): Width of the original highway in meters.

    Returns:
        float: Adjusted traffic volume.
    """
    distance_ratio = my_road_km / 12.87
    width_ratio = my_road_width / 0.0355 
    adjustment_factor = distance_ratio * width_ratio
    adjusted_volume = predicted_volume * adjustment_factor
    return adjusted_volume

#charger le model:
with open("xgboost_model.pkl","rb") as f:
    pipeline=pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    print("hello I am calling the weather ..... I will wait for :")
    response = fetchweather()
    
    data=request.json 
    print("hnaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    print()
    weather_speed_data = {
        "Weather": data["Weather"],
        "Speed_kmh": data["Speed_kmh"]
    }
    df=pd.DataFrame(weather_speed_data)
    #djikstra hna :
    print("calculating the shortest path tfoooo ....")
    response = Find_Shortest_Path_Distance(data["StartPoint"],data["EndPoint"])  
    distance = response[1]["distance"]
    print("here is the distance:",distance)
    traffic_response = predictVolumefile(distance,11)
    # traffic = traffic_response['prediction'] 
    df["Distance_km"] = [distance]
    df["Traffic"] = ["low"]
    # {"Weather": ["clear"], "Speed_kmh": [60], "Distance_km": [10.0], "Traffic": ["low"]}
    prediction=int(pipeline.predict(df)*1.2)
    print(prediction)
    return jsonify([
        {'predictionTime':prediction},
        {'routeCords':response[0]["route"]},
        {'Trafficvolume': int(traffic_response[0])},
        {"distance":distance}
        ])

@app.route('/predictVolume', methods=['POST'])
def predictVolume():
    if model==None:
        return jsonify({'prediction':"no model uploaded in the flask app"})
    data=request.json
    df=pd.DataFrame(data)
    extra=df[['road_km', 'road_width']].copy()
    drop=['road_km', 'road_width']
    df=df.drop(columns=drop, errors='ignore')
    prediction=adjust_volume_by_distance_and_width(model.predict(df)*max_volume,extra["road_km"],extra["road_width"])
    print(prediction.tolist())
    return jsonify({'prediction':prediction.tolist()})


    
def fetchweather():
    city = "Marrakech"
    country = "ma"
    api_key = os.getenv('OPENWEATHER_API_KEY')
    url = f'https://api.openweathermap.org/data/2.5/weather?q={city},{country}&APPID={api_key}'
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching weather data: {response.status_code}")
            return get_default_weather_data()
    except requests.exceptions.RequestException as e:
        print(f"Error: {str(e)}")
        return get_default_weather_data()

def get_default_weather_data():
    """
    Returns default weather data in case the API fails.
    """
    return {
        "main": {
            "temp": 300.0,  
            "humidity": 50,  
            "pressure": 1015 
        },
        "clouds": {
            "all": 50 
        },
        "weather": [
            {
                "description": "few clouds",
                "icon": "01d",
                "main": "Clear"
            }
        ],
        "wind": {
            "speed": 5.0,  
            "deg": 270  
        }
    }


@app.route('/api/weather')
def get_weather():
    response = fetchweather()
    # print(jsonify(response.json()))
    return jsonify(response)

if __name__=='__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
    # Il tra Un probleme f chi model ola nkhedmo b API mea map :)