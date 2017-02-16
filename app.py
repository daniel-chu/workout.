from flask import Flask, render_template, request, redirect
from flask.json import jsonify
from pymongo import MongoClient
import jinja2
import os

app = Flask(__name__)

client = MongoClient(os.environ.get('MONGO_URI'))
db = client['workout-log']
sessions = db.sessions
exercises = db.exercises

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html') 

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    if not username:
        return jsonify(status='error', error='No username given.')
    if not password:
        return jsonify(status='error', error='No password given.')

    return "Login Succesful with username: " + username

if __name__ == '__main__':
    port = int(os.environ.get('PORT'))
    app.run(host='0.0.0.0', port=port,debug=True)


    # example of inserting into DB
    # post = {'name':'daniel',
    #         'id':'10398'}
    # exercises.insert_one(post)