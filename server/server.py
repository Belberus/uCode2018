from flask import Flask,jsonify
from flask_cors import CORS
from pprint import pprint
import pymongo

from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)
CORS(app)

client = pymongo.MongoClient("10.1.57.88",27017)

def clean_data(data):
    if data:
        data = list(data)
        for row in data:
            for k in row:
                if isinstance(row[k],list):
                    row[k] = clean_data(row[k])
                else:
                    row[k] = str(row[k])
        return data

def get_users():
    data = client.ucode2018.users.find()
    data = clean_data(data)
    return data

def get_last_route(id):
    data = client.ucode2018.routes.find({"idUser":id}).sort("creationDate",-1).limit(1)
    data = clean_data(data)
    if data:
        return data[0]

def kmeans_local(coor,ids,user):
    X = np.array(coor)
    label = -1
    k = len(ids)//10
    kmeans = KMeans(n_clusters=k,random_state=0).fit(X)
    for i,l in enumerate(list(kmeans.labels_)):
        if ids[i] == user:
            label = l
            break
    return [n for n,l in zip(ids,kmeans.labels_) if l == label]

@app.route("/getCloseUsers/<idUser>")
def hello(idUser):
    users = get_users()
    ids = [user["idGoogle"] for user in users]
    coors = []
    for i,id in enumerate(ids):
        route = get_last_route(id)
        if route:
            deporte = -1
            speed = float(route["speed"])
            if speed > 0 and speed < 7:
                deporte = 0
            elif speed < 15:
                deporte = 1
            elif speed < 30:
                deporte = 2
            coors.append([route["points"][0]["lat"], route["points"][0]["lng"],deporte,users[i]["team"]])
        else:
            coors.append(["0", "0", "0","0"])
    data = kmeans_local(coors, ids, str(idUser))
    data = [doc for doc in users if doc["idGoogle"] in data]
    return jsonify(data)

if __name__=='__main__':
    app.run(host='0.0.0.0')
