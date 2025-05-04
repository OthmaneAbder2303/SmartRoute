from flask import Flask,request,jsonify
import xgboost as xgb
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import pandas as pd
import os

app=Flask(__name__)
import joblib
max_volume=7280
model_path = 'C:/Users/ayoug/IdeaProjects/SmartRoute/apps/ml-api/traffic_volume_model.joblib'
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    model = None
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
with open("C:/Users/ayoug/IdeaProjects/SmartRoute/apps/ml-api/xgboost_model.pkl","rb") as f:
    pipeline=pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data=request.json # khass tkon {"Distance_km": [10.0],"Weather": ["clear"],"Speed_kmh": [60],"Traffic": ["low"] }
    df=pd.DataFrame(data)
    prediction=pipeline.predict(df)
    return jsonify({'prediction':prediction.tolist()})

@app.route('/predictVolume', methods=['POST'])
def predictVolume():
    if model==None:
        return jsonify({'prediction':"no model uploaded in the flask app"})
    data=request.json
    df=pd.DataFrame(data)
    extra=df[['road_km', 'road_width']].copy()
    drop=['road_km', 'road_width']
    df=df.drop(columns=drop, errors='ignore')
    prediction=adjust_volume_by_distance_and_width(model.predict(df)*max_volume,10,0.01)
    return jsonify({'prediction':prediction.tolist()})


if __name__=='__main__':
    app.run(port=5000)