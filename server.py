from flask import Flask, request, session
from flask_socketio import SocketIO, send, join_room, leave_room
import Chess.ChessObjects as chess
from flask_cors import CORS
import json

boards = {}


app = Flask(__name__)
app.config["SECRET_KEY"] = "fsdfsdfsdf"
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")


""" Creates or joins gameroom """


@app.route("/match", methods=["GET", "POST"])
def match():
    create = request.get_json().get("create")
    join = request.get_json().get("join")

    if create is not None:
        if create in boards.keys():
            return {"error": "game already exists"}
        board = chess.Gameboard()
        board.reset()
        boards[create] = board
        room = create
    elif join is not None:
        if join not in boards.keys():
            return {"error": "Games does not exist"}
        room = join
    else:
        return {"error": "must enter game room name"}
    return {"room": room, "board": boards[room].slice_all()}


""" Initializes board  """


@app.route("/board", methods=["POST", "GET"])
def home():
    room = request.get_json().get("room")
    if room is None or room not in boards:
        return {"board": False, "room": room}
    return {"board": boards[room].slice_all(), "player": boards[room].player}


""" Joins gameroom """


@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in boards.keys():
        return False
    return True


""" Recieves move and sends back board state """


@socketio.on("message")
def message(move1, move2, room):
    join_room(room)
    board = boards[room]
    board.make_a_move(move1, move2)
    state = board.slice_all()

    if board.test_check():
        inCheck = "You're in Check!"
        if board.test_checkmate():
            inCheck = "You're in Checkmate!"
    else:
        inCheck = "Not in Check"
    send(
        {
            "gameroom": room,
            "board": state,
            "player": board.player,
            "inCheck": inCheck,
        },
        to=room,
    )


if __name__ == "__main__":
    socketio.run(app, debug=True)
