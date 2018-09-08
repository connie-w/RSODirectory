# API for querying the database

# Imports the Google Cloud client library
from google.cloud import datastore

# Imports Flask
from flask import Flask, render_template, jsonify
app = Flask(__name__) # Create an instance of Flask class

# service account credentials for Datastore
client = datastore.Client.from_service_account_json(
        'udev-rsodirectory-53eb9f38363b.json')

# Takes a list of RSO entities and converts it to JSON
def convertToJson(entityList):
    #print("RSOs found:" + str(len(entityList)))
    out = []
    for i in range(len(entityList)):
        obj = {}
        obj["name"] = entityList[i]['name']
        obj["description"] = entityList[i]['description']
        obj["email"] = entityList[i]['email']
        obj["category"] = entityList[i]['category']
        obj["logo"] = entityList[i]['logo']
        obj["fb"] = entityList[i]['fb']
        out.append(obj)
    return out

# Prints a JSON of all RSOs
def queryAll(client):
    query = client.query(kind='RSO')
    query.order = ['name']
    results = list(query.fetch())
    out = convertToJson(results)
    # TODO: add support for cursors, returning in batches
    print(out)

# Prints a JSON of RSOs with the given catagory (cat)
def queryCategory(client, cat):
    query = client.query(kind='RSO')
    query.order = ['name']
    query.add_filter('category', '=', cat)
    results = list(query.fetch())
    print(len(results))
    out = convertToJson(results)
    print(out)
