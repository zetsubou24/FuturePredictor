import numpy as np
import pandas as pd
from pandas import concat, DataFrame
from sklearn.model_selection import train_test_split
import os
import math
from sklearn import tree
import json
import flask
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

with open('../data/location_history_102014.json') as f:
    data = json.load(f)


locs = data['locations']
locs = list(locs)

locs.sort(key=lambda x: x['timestampMs'])
LAT = []
LONG = []
COMBINED = []
minx, miny = math.inf, math.inf
maxx, maxy = -math.inf, -math.inf
for each in locs:
    COMBINED.append([each['longitudeE7']/1e7, each['latitudeE7']/1e7])


def series_to_supervised(data, n_in=1):
    temp = data[0]
    for i in range(n_in-1):
        data.insert(0, temp)
    mat = []
    y = []
    for i in range(3, len(data)):
        v = [data[i-3], data[i-2], data[i-1]]
        mat.append(v)
        y.append(data[i])
    return np.array(mat), np.array(y)


values = COMBINED
data, label = series_to_supervised(values, 3)


clf = tree.DecisionTreeRegressor()
nsamples, nx, ny = data.shape
d2_train_dataset = data.reshape((nsamples, nx*ny))
x = d2_train_dataset
y = label

print(x[7])
print(y[7])


clf = clf.fit(x, y)
testput = [[-3.6286935, 40.4212216],
           [-3.628588, 40.4231694], [-3.6275805, 40.4212471]]
test = np.array(testput).flatten()
print(test)
ans = clf.predict([test])
print(ans)
print(ans[0][0], ans[0][1])


@app.route('/getLocation', methods=['GET'])
def home():
    apiloc = {
        "Latitude": ans[0][1],
        "Longitude": ans[0][0]
    }
    return jsonify(apiloc)
app.run()
