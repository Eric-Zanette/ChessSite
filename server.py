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
def message(move1, move2):
    global state
    print(move1)
    print(move2)
    board.make_a_move(move1, move2)
    print(board.render("player"))
    state = board.slice_all()
    send(state)


if __name__ == "__main__":
    socketio.run(app, debug=True)
