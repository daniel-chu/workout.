from flask import Flask, render_template, request, redirect
from flask.json import jsonify
from bson import json_util
from pymongo import MongoClient
from workoutUtils import *
import jinja2
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY')

client = MongoClient(os.environ.get('MONGO_URI'))
db = client['workout-log']

users = db.users
exercises = db.exercises
workoutSessions = db.workoutsessions
sets = db.sets

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html') 

@app.route('/', methods=['POST'])
def check_logged_in():
    if not is_logged_in():
        return jsonify(status='error', error='Not logged in.')
    return jsonify(status='success')

@app.route('/login', methods=['POST'])
def login():
    username = request.form.get('username')
    password = request.form.get('password')
    lowerCaseUsername = username.lower()

    if not username:
        return jsonify(status='error', error='No username given.')
    if not password:
        return jsonify(status='error', error='No password given.')

    loginAttemptUser = users.find_one({'username':lowerCaseUsername})

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
    password_confirmed = request.form.get('passwordConfirm')

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

    if not valid_email_pattern(email):
        return jsonify(status='error', error='Please enter a valid email.')
    if not valid_username_length(username):
        return jsonify(status='error',
            error='Username must be 3-20 characters long.')
    if not valid_username_characters(username):
        return jsonify(status='error',
            error='Username can only contain letters, numbers, periods(.), underscores(_), and dashes(-).')
    if not valid_password_length(password):
        return jsonify(status='error',
            error='Password must be between 3-32 characters long.')

    existing_email = users.find_one({'email':email})
    existing_username = users.find_one({'username':username})

    if not existing_username is None:
        return jsonify(status='error', error='Username already taken.')
    if not existing_email is None:
        return jsonify(status='error', error='Email already in use.')

    hashed_and_salted_pw = hash_password(password)
    users.insert({'_id':gen_unique_string_id(), 'username':username, 'email':email, 'password':hashed_and_salted_pw})
    
    return jsonify(status='success')

@app.route('/retrieveUsername', methods=['GET'])
def retrieveUsername():
    return retrieve_username()

@app.route('/addWorkoutSession', methods=['POST'])
def addWorkoutSession():
    dateString = request.form.get('dateString')
    dateNumber = request.form.get('dateNumber')
    username = retrieve_username().lower()
    userToAddTo = users.find_one({'username': username})
    if userToAddTo is not None:
        newWorkoutSessionId = workoutSessions.insert({'_id':gen_unique_string_id(),
            'userId':userToAddTo['_id'], 'dateString':dateString, 'dateNumber':dateNumber})
    return jsonify(status='success', newWorkoutSessionId=json_util.dumps(newWorkoutSessionId))


@app.route('/getWorkoutSessions', methods=['GET'])
def getWorkoutSessions():
    username = retrieve_username().lower()
    userToAddTo = users.find_one({'username': username})
    resultWorkoutSessions = workoutSessions.find({'userId':userToAddTo['_id']}).sort('dateNumber', -1)
    return jsonify(status='success', allWorkoutSessions=json_util.dumps(resultWorkoutSessions))

@app.route('/deleteWorkoutSession', methods=['POST'])
def deleteWorkoutSession():
    workoutIdToRemove = request.form.get('workoutIdToRemove')
    hasAssociatedSets = request.form.get('hasAssociatedSets')

    if hasAssociatedSets:
        sets.delete_many({'workoutId':workoutIdToRemove})

    username = retrieve_username().lower()
    userToRemoveFrom = users.find_one({'username': username})
    deleteStatus = workoutSessions.delete_one({'_id':workoutIdToRemove})
    if deleteStatus.deleted_count is not 0:
        return jsonify(status='success')
    else:
        return jsonify(status='error', error='Error with deletion, no documents deleted.')

@app.route('/addNewSet', methods=['POST'])
def addNewSet():
    username = retrieve_username().lower()
    userToAddExerciseTo = users.find_one({'username': username})
    user_id = userToAddExerciseTo['_id']

    workout_id = request.form.get('workoutId')
    exercise_name = request.form.get('exerciseName')
    exercise_name = exercise_name.lower().title()
    option_one_type = request.form.get('optionOneType')
    option_one_value = request.form.get('optionOneValue')
    option_two_type = request.form.get('optionTwoType')
    option_two_value = request.form.get('optionTwoValue')
    date_time_performed = request.form.get('dateTimePerformed')

    existing_exercise = exercises.find_one({ '$or' : [ {'name': exercise_name, 'userId':user_id,
        'optionOneType':option_one_type, 'optionTwoType':option_two_type}, {'name': exercise_name, 'userId':'PUBLIC',
        'optionOneType':option_one_type, 'optionTwoType':option_two_type} ] })
    if existing_exercise is None:
        exercise_id = exercises.insert({'_id':gen_unique_string_id(), 'userId':user_id,
            'name':exercise_name, 'optionOneType':option_one_type, 'optionTwoType':option_two_type})
    else:
        exercise_id = existing_exercise['_id']

    new_set_id = sets.insert({'_id':gen_unique_string_id(), 'workoutId':workout_id, 'userId':user_id,
        'exerciseName':exercise_name, 'exerciseId':exercise_id, 'optionOneType':option_one_type,
        'optionOneValue':option_one_value, 'optionTwoType':option_two_type, 'optionTwoValue':option_two_value,
        'dateTimePerformed':date_time_performed})

    return jsonify(status='success', exerciseId=exercise_id, setId=new_set_id)

@app.route('/retrieveExerciseOptions', methods=['GET'])
def retrieveExerciseOptions():
    username = retrieve_username().lower()
    user = users.find_one({'username': username})
    user_id = user['_id']
    exercise_name = request.args.get('exerciseName')

    # finds user version first
    selectedExercise = exercises.find_one({ 'name': exercise_name, 'userId':user_id })

    # if there is no user version, it will try to find the public version
    if selectedExercise is None:
        selectedExercise = exercises.find_one({ 'name': exercise_name, 'userId':'PUBLIC' })
        # nothing found (this case should never happen without the user directly making AJAX calls through console)
        if selectedExercise is None:
            return jsonify(status='error', error='No exercise with this name found')

    return jsonify(status='success', optionOneType=selectedExercise['optionOneType'],
        optionTwoType=selectedExercise['optionTwoType'])

@app.route('/getExercisesForUser', methods=['GET'])
def getUsersExercises():
    username = retrieve_username().lower()
    user = users.find_one({'username': username})
    user_id = user['_id']

    usersExercises = exercises.find( {'$or' : [ {'userId':user_id}, {'userId':'PUBLIC'} ] }).sort('name', 1)
    return jsonify(status='success', allExercisesForUser=json_util.dumps(usersExercises))

@app.route('/getSets', methods=['GET'])
def getSets():
    username = retrieve_username().lower()
    user = users.find_one({'username': username})
    user_id = user['_id']
    workout_id = request.args.get('workoutId')

    setsInWorkout = sets.find({'workoutId':workout_id, 'userId':user_id}).sort('dateTimePerformed', 1)
    return jsonify(status='success', setsInWorkout=json_util.dumps(setsInWorkout))

@app.route('/removeSet', methods=['POST'])
def removeSet():
    username = retrieve_username().lower()
    user = users.find_one({'username': username})
    user_id = user['_id']
    set_id = request.form.get('setId')
    sets.delete_one({'_id':set_id, 'userId':user_id})
    return jsonify(status='success')

@app.route('/logout', methods=['POST'])
def logout():
    if is_logged_in():
        log_out()
    return jsonify(status='success')

if __name__ == '__main__':
    port = int(os.environ.get('PORT'))
    app.run(host='0.0.0.0', port=port,debug=True)