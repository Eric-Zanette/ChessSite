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
    return {"board": state, "player": board.player}


@socketio.on("message")
def message(move1, move2):
    print("LOLOLOLLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    global state
    board.make_a_move(move1, move2)
    print(board.player)
    state = board.slice_all()
    send({"board": state, "player": board.player})


if __name__ == "__main__":
    socketio.run(app, debug=True)
