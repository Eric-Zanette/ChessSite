from app import db
from flask import request
from app import app
from app.validators import registration_validation, login_validation
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, Game
import jwt
import json

jwt_key = app.config["SECRET_KEY"]


@app.route("/api/games", methods=["POST"])
def get_games():
    token = request.get_json()["token"]

    decoded = jwt.decode(token, jwt_key, algorithms=["HS256"])

    user = User.query.filter_by(email=decoded["email"]).first()

    games = Game.query.filter(
        (Game.user_id_black == user.id) | (Game.user_id_white == user.id)
    ).all()

    gameData = map(
        lambda x: {
            "white": User.query.get(x.user_id_white).username,
            "black": User.query.get(x.user_id_black).username,
            "winner": User.query.get(x.winner).username,
            "name": x.room,
        },
        games,
    )

    return json.dumps(list(gameData))
