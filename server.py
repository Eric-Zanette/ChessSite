from flask import Flask
from flask_socketio import SocketIO, send
import Chess.ChessObjects as chess
from flask_cors import CORS


board = chess.Gameboard()
board.reset()
state = board.slice("shortname")

print(state)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/", methods=["POST", "GET"])
def home():
    return state


@socketio.on("message")
def message(move):
    print(move)


"""     board.make_a_move(move)
    send(board.slice("shortname")) """


if __name__ == "__main__":
    socketio.run(app, debug=True)
