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




# Input exemple :
# origin_point = (31.6643, -8.0500)          
# destination_point = (31.6258, -7.9892) 
def Find_Shortest_Path_Distance(origin_point,destination_point):

    print(os.path.exists('marrakech_streets.gpkg'))
    # graph
    print("loading graph......")
    # Load   (streets)
    edges = gpd.read_file("marrakech_streets.gpkg", layer="edges")

    # Load   (intersections)
    nodes = gpd.read_file("marrakech_streets.gpkg", layer="nodes")
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

    else:
        print(f'les deux points sont accessible')
        #  plus court chemin  de la distance
        shortest_path = nx.shortest_path(G, source=origin_node, target=destination_node, weight='length')
        #print("shortest_path is :",shortest_path)
        # Tracer le graphe 
        # fig, ax = ox.plot_graph_route(G, shortest_path, route_linewidth=3, node_size=10, edge_linewidth=0.5)

    route_coords = [(G.nodes[node]['y'], G.nodes[node]['x']) for node in shortest_path]
    distance = nx.dijkstra_path_length(G, origin_node, destination_node)
    # print("distance tfooo:",distance/10)

    response=[
        {"route":route_coords},
        {"distance":distance/10} #km
    ]
    return response
def predictVolumefile(dataWeather,distance):
    now = datetime.now()

    hour = now.hour
    day_of_week = now.weekday()      # Monday = 0, Sunday = 6
    day_of_month = now.day
    month = now.month
    sample = pd.DataFrame({
    'temp': [285.32],
    'rain_1h': [0.0],
    'snow_1h': [0.0],
    'clouds_all': [75],
    'hour': [hour],
    'day_of_week': [day_of_week],  # Tuesday
    'month': [month],
    'is_holiday': [0],
    'weather_main_Clouds': [True],
    'weather_main_Drizzle': [False],
    'weather_main_Fog': [False],
    'weather_main_Haze': [False],
    'weather_main_Mist': [False],
    'weather_main_Rain': [False],
    'weather_main_Smoke': [False],
    'weather_main_Snow': [False],
    'weather_main_Squall': [False],
    'weather_main_Thunderstorm': [False],
    'weather_description_Sky is Clear': [False],
    'weather_description_broken clouds': [True],  # Assume broken clouds
    'weather_description_drizzle': [False],
    'weather_description_few clouds': [False],
    'weather_description_fog': [False],
    'weather_description_freezing rain': [False],
    'weather_description_haze': [False],
    'weather_description_heavy intensity drizzle': [False],
    'weather_description_heavy intensity rain': [False],
    'weather_description_heavy snow': [False],
    'weather_description_light intensity drizzle': [False],
    'weather_description_light intensity shower rain': [False],
    'weather_description_light rain': [False],
    'weather_description_light rain and snow': [False],
    'weather_description_light shower snow': [False],
    'weather_description_light snow': [False],
    'weather_description_mist': [False],
    'weather_description_moderate rain': [False],
    'weather_description_overcast clouds': [False],
    'weather_description_proximity shower rain': [False],
    'weather_description_proximity thunderstorm': [False],
    'weather_description_proximity thunderstorm with drizzle': [False],
    'weather_description_proximity thunderstorm with rain': [False],
    'weather_description_scattered clouds': [False],
    'weather_description_shower drizzle': [False],
    'weather_description_shower snow': [False],
    'weather_description_sky is clear': [False],
    'weather_description_sleet': [False],
    'weather_description_smoke': [False],
    'weather_description_snow': [False],
    'weather_description_thunderstorm': [False],
    'weather_description_thunderstorm with drizzle': [False],
    'weather_description_thunderstorm with heavy rain': [False],
    'weather_description_thunderstorm with light drizzle': [False],
    'weather_description_thunderstorm with light rain': [False],
    'weather_description_thunderstorm with rain': [False],
    'weather_description_very heavy rain': [False],
    'traffic_volume_lag1': [1800.0],
    'traffic_volume_lag2': [1700.0],
    'year': [now.year],
    'day_of_month': [day_of_month],
    }, index=[pd.to_datetime('2018-10-02 14:00:00')])
    prediction=adjust_volume_by_distance_and_width(model.predict(sample)*max_volume,distance,0.0086)
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
    width_ratio = my_road_width / 0.0355 #data of the road that has been researched aboout
    adjustment_factor = distance_ratio * width_ratio
    adjusted_volume = predicted_volume * adjustment_factor
    return adjusted_volume

#charger le model:
with open("xgboost_model.pkl","rb") as f:
    pipeline=pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    response = fetchweather()
    print(response)
    data=request.json 
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
    traffic_response = predictVolumefile(data["Weather"],distance)
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
    response = requests.get(url)
    return response

@app.route('/api/weather')
def get_weather():
    response = fetchweather()
    print(response)
    return jsonify(response.json())

if __name__=='__main__':
    app.run(port=5000,debug=True)
    # Il tra Un probleme f chi model ola nkhedmo b API mea map :)