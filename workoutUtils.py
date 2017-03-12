from flask import session
import hashlib
import bcrypt
import uuid
import re

usernameRegex = re.compile('^[a-zA-Z0-9-_.]+$')
emailRegex = re.compile('^.+@.+\..+$')

def gen_unique_string_id():
    return str(uuid.uuid4())

def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password

def validate_user_and_password(user, attempted_password):
    if attempted_password is None:
        return False
    hashed_actual_pw = user['password']
    return bcrypt.hashpw(attempted_password.encode('utf-8'),
        hashed_actual_pw.encode('utf-8')) == hashed_actual_pw

def log_in(username):
    session['username'] = username
    session.permanent = True

def log_out():
    session.pop('username', None)

def is_logged_in():
    if session.get('username') is None:
        log_out()
        return False
    return True

def retrieve_username():
    return session.get('username')

def valid_username_length(username):
    return len(username) > 2 and len(username) < 21

def valid_username_characters(username):
    if re.match(usernameRegex, username):
        return True
    return False

def valid_password_length(password):
    return len(password) > 2 and len(password) < 33

def valid_email_pattern(email):
    if re.match(emailRegex, email):
        return True
    return False
