from app import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(128))
    white_games = db.relationship(
        "Game", backref="white_player", foreign_keys="Game.user_id_white"
    )
    black_games = db.relationship(
        "Game", backref="black_player", foreign_keys="Game.user_id_black"
    )
    games_won = db.relationship("Game", backref="game_won", foreign_keys="Game.winner")

    def __repr__(self):
        return "<User {}>".format(self.username)


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    room = db.Column(db.String(64), index=True)
    winner = db.Column(db.Integer, db.ForeignKey("user.id"), name="winner")
    user_id_white = db.Column(db.Integer, db.ForeignKey("user.id"), name="white_id")
    user_id_black = db.Column(db.Integer, db.ForeignKey("user.id"), name="black_id")

    def __repr__(self):
        return "<Room {}>".format(self.room)
