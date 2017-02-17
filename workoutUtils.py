import hashlib
import bcrypt
import uuid

def gen_unique_string_id():
    return str(uuid.uuid4());

def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password

def validate_user_and_password(user, attempted_password):
    if attempted_password is None:
        return False
    hashed_actual_pw = user["password"]
    return bcrypt.hashpw(attempted_password.encode('utf-8'),
        hashed_actual_pw.encode('utf-8')) == hashed_actual_pw

