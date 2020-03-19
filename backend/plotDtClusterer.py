import hdbscan
import json
from sklearn import tree
import pickle
import math
import numpy as np
# import multiprocessing 
import argparse
import flask
from flask import request, jsonify
from flask_cors import CORS

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

parser = argparse.ArgumentParser()
parser.add_argument("-v", "--verbose", action="store_true",
                    help="increase output verbosity")
parser.add_argument("-p", "--showPlot", action="store_true",
                    help="show plot")
parser.add_argument("-f","--useFolium",action="store_true",
                    help="Use Folium Python Graph Api to Generate Static html for Markers")
parser.add_argument("-s", "--storeResults", action="store_true",
                    help="store intermediate results in text file")
args = parser.parse_args()
if args.useFolium:
  import folium
  print("::WARNING:: Using Folium, Data processing is Intensive and may take some time to load on browser,depending on pc.")
if args.verbose:print("Loading and pre-processing data")
with open('./location_history_102014.json') as f:
  data = json.load(f)
# print(data['locations'][0])
locs=data['locations']
locs=list(locs)
locs.sort(key=lambda x:x['timestampMs'])
# print(locs[:10])
LAT=[];LONG=[];COMBINED=[]
for each in locs:
    LAT.append(each['longitudeE7']/1e7)
    LONG.append(each['latitudeE7']/1e7)
    COMBINED.append([each['longitudeE7']/1e7,each['latitudeE7']/1e7])
if args.verbose:print("Data Transformation Successful")

points=COMBINED
if args.verbose:print("Identifying Clusters...")
rads = np.radians(points)
clusterer = hdbscan.HDBSCAN(min_cluster_size=2, metric='haversine')
cluster_labels = clusterer.fit_predict(points)
if args.verbose:print("Clusters Identified")
# print()
# print(len(cluster_labels))
if args.storeResults:f = open("a.out", "w");f.write(str(set(cluster_labels)))
if args.verbose:print("Calculating Centroids...")
if args.verbose:print(len(cluster_labels),len(points))
from collections import defaultdict
dict=defaultdict(list)
cntlist=defaultdict(int)
for i in range(len(cluster_labels)):
  dict[cluster_labels[i]].append(points[i])
  cntlist[cluster_labels[i]]+=1
centroids=[]
import functools
for each in dict.items():
  centroids.append(functools.reduce(lambda a,b:[(a[0]+b[0])/2,(a[1]+b[1])/2],each[1]))
# print(centroids)
if args.verbose:print("Centroids Calulated")
if args.storeResults:f=open("a3.out","w");f.write(str(cntlist))
if args.useFolium:
  m = folium.Map(
    location=[-3.6286064 , 40.4212548][::-1],
    tiles='Stamen Terrain',
    zoom_start=10
  )
  for each in range(len(centroids)):
      folium.CircleMarker(
      radius=(cntlist[each]//100)*5,
      location=centroids[each][::-1],
      popup='Laurelhurst Park',
      color='#3186cc',
      fill=True,
      fill_color='#3186cc'
      ).add_to(m)

  m.save('index.html')
#=====================================================
def series_to_supervised(data, n_in=1):
  temp=data[0]
  for i in range(n_in-1):
    data.insert(0,temp)
  mat=[]
  y=[]
  z=[]
  # print(data[:5])
  for i in range(3,len(data)):
    v=[data[i-3],data[i-2],data[i-1]]
    mat.append(v)
    y.append(data[i])
    # z.append(pd.DataFrame(v))
  return np.array(mat),np.array(y)

if args.verbose:print("Converting and building Model... ")
values = centroids
data,label = series_to_supervised(values, 3)
clf=tree.DecisionTreeRegressor()
nsamples, nx, ny = data.shape
d2_train_dataset = data.reshape((nsamples,nx*ny))
x=d2_train_dataset
y=label
clf=clf.fit(x,y)
if args.verbose:
  print("model built!")
  print("test input is",x[7])
  print("Known answer is",y[7])
filename = 'finalized_model2.sav'
pickle.dump(clf, open(filename, 'wb'))
if args.verbose:print("Model saved.")
clf=pickle.load(open(filename, 'rb'))
testput=[[-3.6286064 , 40.4212548] , [-3.62863389, 40.42133821],[ -3.62858095, 40.4212467]]
test=np.array(testput).flatten()
if args.verbose:print("test input is",test)
ans=clf.predict([test])
if args.verbose:print("predicted answer is",ans)
coordinates= centroids
if args.storeResults:f=open("a2.out","w");f.write(str(centroids))
if args.showPlot:
  import matplotlib.pyplot as plt
  import pandas as pd
  import colorsys
  N = len(cluster_labels)
  sect=centroids
  HSV = [(x*1.0/N, 0.5, 0.5) for x in range(N)]
  RGB = list(map(lambda x: colorsys.hsv_to_rgb(*x), HSV))
  fig, ax = plt.subplots()
  N = len(cluster_labels)
  x, y = LAT,LONG
  scatter = ax.scatter(x, y, c=RGB)
  legend1 = ax.legend(*scatter.legend_elements(),
                    loc="lower left", title="Classes")
  ax.add_artist(legend1)
  handles, labels = scatter.legend_elements(prop="sizes", alpha=0.6)
  legend2 = ax.legend(handles, labels, loc="upper right", title="Sizes")
  plt.show()
@app.route('/getLocation', methods=['GET'])
def home():
    apiloc = {
        "Latitude": ans[0][1],
        "Longitude": ans[0][0]
    }
    return jsonify(apiloc)
app.run()