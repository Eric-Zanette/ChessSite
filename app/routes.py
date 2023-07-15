from app import db
from flask import request
from werkzeug.urls import url_parse
from app import app
from app.validators import registration_validation, login_validation
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
import jwt

jwt_key = "zzzzxxxxxcccccvvvvvaassddff"


@app.route("/register", methods=["POST"])
def register():
    print(request.get_json())
    req = request.get_json()

    errors = registration_validation(req)

    if User.query.filter_by(email=req["email"]).first() is not None:
        errors["email"] = "Email already registered"

    if len(errors.keys()) == 0:
        try:
            hashed_pass = generate_password_hash(req["password"])
            user = User(
                username=req["username"], email=req["email"], password=hashed_pass
            )
            db.session.add(user)
            db.session.commit()
            return {"msg": "Success!"}
        except:
            return {"msg": "error!"}
    else:
        return errors


@app.route("/login", methods=["POST"])
def login():
    req = request.get_json()
    errors = login_validation(req)

    if len(errors.keys()) == 0:
        user = User.query.filter_by(email=req["email"]).first()
        if user and check_password_hash(user.password, req["password"]):
            token = jwt.encode(
                {"username": user.username, "email": user.email},
                jwt_key,
                algorithm="HS256",
            )

            return {"token": f"{token}"}
        else:
            return {"email": "Username and Password Combo invalid"}
    else:
        return errors


@app.route("/user", methods=["POST"])
def get_user():
    token = request.get_json()["token"]
    print(token)
    try:
        decoded = jwt.decode(token, jwt_key, algorithms=["HS256"])
    except:
        return {"error": "user does not exist"}
    if User.query.filter_by(email=decoded["email"]).first() is not None:
        return {"email": decoded["email"], "username": decoded["username"]}
    else:
        return {"error": "user does not exist"}
