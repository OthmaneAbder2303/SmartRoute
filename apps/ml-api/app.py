from flask import Flask,request,jsonify
import xgboost as xgb
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import pandas as pd
import os
from huggingface_hub import hf_hub_download
import geopandas as gpd
import networkx as nx
from shapely.geometry import Point, LineString
import osmnx as ox


app=Flask(__name__)
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
    #volume hna : hadhi ma3rftch ach kayretourner 3nd zaki
    # traffic_response = predictVolume(data["Weather"],data["Speed_kmh"],distance)
    # traffic = traffic_response['prediction'] 
    df["Distance_km"] = [distance]
    df["Traffic"] = ["low"]
    # {"Weather": ["clear"], "Speed_kmh": [60], "Distance_km": [10.0], "Traffic": ["low"]}
    prediction=int(pipeline.predict(df)*1.2)
    return jsonify([
        {'predictionTime':prediction},
        {'routeCords':response[0]["route"]},
        {'Trafficvolume':2000},
        {"distance":distance}
        ])

@app.route('/predictVolume', methods=['POST'])
def predictVolume():
    print("je clcule volume wa ......")
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

if __name__=='__main__':
    app.run(port=5000,debug=True)
    # Il tra Un probleme f chi model ola nkhedmo b API mea map :)