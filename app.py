from flask import Flask, render_template, request, redirect
from flask.json import jsonify
from pymongo import MongoClient
from workoutUtils import *
import jinja2
import os

app = Flask(__name__)
app.secret_key=os.environ.get('SECRET_KEY')

client = MongoClient(os.environ.get('MONGO_URI'))
db = client['workout-log']
users = db.users
sessions = db.sessions
sets = db.sets
exercises = db.exercises

@app.route('/')
def index():
    return render_template('index.html') 

@app.route('/', methods=['POST'])
def getLogs():
    if not is_logged_in():
        return jsonify(status='error', error='Not logged in.');
    #TODO return actual data
    return jsonify(status='success');

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get("username")
    password = request.form.get("password")

    if not username:
        return jsonify(status='error', error='No username given.')
    if not password:
        return jsonify(status='error', error='No password given.')

    username = username.lower()
    loginAttemptUser = users.find_one({"username":username})

    if loginAttemptUser is None:
        return jsonify(status='error', error='Invalid username or password.')
    if(validate_user_and_password(loginAttemptUser, password)):
        log_in(username)
        return jsonify(status='success')
    else:
        return jsonify(status='error',error='Invalid username or password.')

@app.route('/registerUser', methods=['POST'])
def register_user():
    name = request.form.get('name')
    email = request.form.get('email')
    email = email.lower()
    username = request.form.get('username')
    username = username.lower()
    password = request.form.get('password')
    password_confirmed = request.form.get("passwordConfirm")

    if not name:
        return jsonify(status='error', error='Please enter your name.')
    if not email:
        return jsonify(status='error', error='Please enter an email address.')
    if not username:
        return jsonify(status='error', error='Please enter a username.')
    if not password:
        return jsonify(status='error', error='Please enter a password.')
    if not password_confirmed:
        return jsonify(status='error', error='Please confirm your password.')
    if password != password_confirmed:
        return jsonify(status='error', error='Passwords do not match.')

    # TODO CHECK FOR VALID USERNAME/PASSWORD/EMAIL

    existing_email = users.find_one({'email':email})
    existing_username = users.find_one({'username':username})

    if not existing_username is None:
        return jsonify(status='error', error='Username already taken.')
    if not existing_email is None:
        return jsonify(status='error', error='Email already in use.')

    hashed_and_salted_pw = hash_password(password)
    users.insert_one({"_id":gen_unique_string_id(), "username":username, "email":email, "password":hashed_and_salted_pw})
    
    return jsonify(status='success')

@app.route('/retrieveUsername', methods=['POST'])
def retrieveUsername():
    return retrieve_username();

@app.route('/logout', methods=['POST'])
def logout():
    if is_logged_in():
        log_out()
    return jsonify(status='success');

if __name__ == '__main__':
    port = int(os.environ.get('PORT'))
    app.run(host='0.0.0.0', port=port,debug=True)