from flask import request, session
from flask_socketio import SocketIO, send, join_room, leave_room, emit
import Chess.ChessObjects as chess
from app import app
from app import db
from app import socketio
from app import db
import json

""" active boards """
boards = {}

""" Gets active boards """


@app.route("/api/boards", methods=["GET"])
def get_boards():
    board_list = []
    full = False
    for room in boards.keys():
        game = boards[room]
        if "Black" in game.keys():
            full = "Full"
        else:
            full = "Not Full"

        board_list.append({"createdBy": game["White"], "full": full, "name": room})
    print(board_list)

    return board_list


""" Creates or joins gameroom """
""" TODO clean up this logic """


@app.route("/api/match", methods=["GET", "POST"])
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


@app.route("/api/board", methods=["POST", "GET"])
def home():
    room = request.get_json().get("room")
    if room not in boards.keys():
        return ""
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


@app.route("/api/room")
def room():
    room = session.get("room")
    if room is None or session.get("name") is None or room not in boards.keys():
        return False
    return True


""" Recieves move and sends back board state """


@socketio.on("message")
def message(move1, move2, room, name):
    join_room(room)

    if move1 == None:
        return ""

    if room not in boards.keys():
        return ""

    from app.models import Game, User

    board = boards[room]["board"]
    boardroom = boards[room]

    if "Black" not in boardroom.keys():
        print(boardroom)
    elif boards[room][board.player] == name:
        board.make_a_move(move1, move2)
        state = board.slice_all()

        """ Test for Check """
        if board.test_check():
            inCheck = "You're in Check!"

            """ If checkmate log game and exit """
            if board.test_checkmate():
                inCheck = "Checkmate!"
                game = Game(
                    room=room,
                    winner=User.query.filter_by(username=boardroom[board.player2])
                    .first()
                    .id,
                    user_id_white=User.query.filter_by(username=boardroom["White"])
                    .first()
                    .id,
                    user_id_black=User.query.filter_by(username=boardroom["Black"])
                    .first()
                    .id,
                )
                db.session.add(game)
                db.session.commit()
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
        """ Delete room after checkmate """
        if inCheck == "Checkmate!":
            del boards[room]
