from flask import Flask,request,jsonify
import xgboost as xgb
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import pandas as pd

app=Flask(__name__)

#charger le model:
with open("C:/Users/el houcine/Desktop/pfs/SmartRoute/apps/ml-api/xgboost_model.pkl","rb") as f:
    pipeline=pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data=request.json # khass tkon {"données json   "Distance_km": [10.0],"Weather": ["clear"],"Speed_kmh": [60],Traffic": ["low"] }
    df=pd.DataFrame(data)
    prediction=pipeline.predict(df)
    return jsonify({'prediction':prediction.tolist()})



if __name__=='__main__':
    app.run(port=5000)
    