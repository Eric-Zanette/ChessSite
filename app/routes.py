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
    req = request.get_json()
    errors = registration_validation(req)

    if len(errors.keys()) == 0:
        hashed_pass = generate_password_hash(req["password"])
        user = User(username=req["username"], email=req["email"], password=hashed_pass)
        db.session.add(user)
        db.session.commit()
        return "success!"
    else:
        return errors


@app.route("/login", methods=["POST"])
def login():
    req = request.get_json()
    errors = login_validation(req)

    if len(errors.keys()) == 0:
        user = User.query.filter_by(email=req["email"]).first()
        if user and check_password_hash(user.password, req["password"]):
            token = jwt.encode({"username": user.username}, jwt_key, algorithm="HS256")

            return {"token": f"bearer {token}"}
        else:
            return {"username": "Username and Password Combo invalid"}
    else:
        return errors
