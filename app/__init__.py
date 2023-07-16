from flask import Flask, request, session
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_socketio import SocketIO, send, join_room, leave_room
import Chess.ChessObjects as chess
from flask_cors import CORS
from flask_login import LoginManager


boards = {}

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)

from app import models, routes


""" Creates or joins gameroom """


@app.route("/match", methods=["GET", "POST"])
def match():
    create = request.get_json().get("create")
    join = request.get_json().get("join")
    name = request.get_json().get("name")

    if create is not None:
        if len(create) == 0:
            return {"create": "must enter game room name"}
        if create in boards.keys():
            return {"create": "game already exists"}
        board = chess.Gameboard()
        board.reset()
        boards[create] = {"board": board, "White": name}
        room = create
        player = name
        print(player)
    elif join is not None:
        if len(join) == 0:
            return {"join": "must enter game room name"}
        if join not in boards.keys():
            return {"join": "Games does not exist"}
        boardRoom = boards[join]
        board = boardRoom["board"]
        if boardRoom["White"] != name:
            boardRoom["Black"] = name
        room = join
    return {"room": room, "name": name}


""" Initializes board  """


@app.route("/board", methods=["POST", "GET"])
def home():
    room = request.get_json().get("room")
    boardRoom = boards[room]
    board = boards[room]["board"]
    playerColor = board.player
    if room is None or room not in boards:
        return {"board": False, "room": room}
    return {
        "board": board.slice_all(),
        "player": boardRoom[board.player],
    }


""" Joins gameroom """


@app.route("/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in boards.keys():
        return False
    return True


""" Recieves move and sends back board state """


@socketio.on("message")
def message(move1, move2, room, name):
    join_room(room)
    board = boards[room]["board"]
    boardroom = boards[room]

    if "Black" not in boardroom.keys():
        print(boardroom)
    elif boards[room][board.player] == name:
        board.make_a_move(move1, move2)
        state = board.slice_all()
        if board.test_check():
            inCheck = "You're in Check!"
            if board.test_checkmate():
                inCheck = "Checkmate!"
        else:
            inCheck = ""
        send(
            {
                "gameroom": room,
                "board": state,
                "player": boards[room][board.player],
                "inCheck": inCheck,
            },
            to=room,
        )


if __name__ == "__main__":
    socketio.run(app, debug=True)
