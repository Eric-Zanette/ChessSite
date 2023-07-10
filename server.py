from flask import Flask
from flask_socketio import SocketIO, send
import Chess.ChessObjects as chess
from flask_cors import CORS
import json


board = chess.Gameboard()
board.reset()
state = board.slice_all()
jsonState = json.dumps(state)


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/board", methods=["POST", "GET"])
def home():
    return state


@socketio.on("message")
def message(move):
    response = board.valid_moves(move)
    send(response)


if __name__ == "__main__":
    socketio.run(app, debug=True)
