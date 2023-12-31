import { useEffect, useState } from "react";
import io from "socket.io-client";
import Piece from "./Piece";
import socketio from "../socket";
import UsersContext from "../context/Users";
import { useContext } from "react";

const Board = ({ room, setRoom }) => {
  /* Initialize empty board */

  const baseboard = [];
  for (let i = 0; i < 8; i++) {
    const baseline = [];
    for (let j = 0; j < 8; j++) {
      baseline.push({
        color: (i + j) % 2 == 0 ? "white" : "black",
      });
    }
    baseboard.push(baseline);
  }

  const { user } = useContext(UsersContext);

  const [board, setBoard] = useState(baseboard);
  const [moves, setMoves] = useState([]);
  const [player, setPlayer] = useState();
  const [inCheck, setInCheck] = useState();
  const [validMoves, setValidMoves] = useState([]);

  /* Receives updated board state */
  useEffect(() => {
    socketio.on("message", (data) => {
      addToBoard(data.board);
      setPlayer(data.player);
      setInCheck(data.inCheck);
    });
    socketio.emit("message", null, null, room, null);
  }, []);

  /* get pieces state */
  useEffect(() => {
    fetch("/api/board", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room: room }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.board != false) {
          addToBoard(data.board);
          setPlayer(data.player);
          setInCheck(data.inCheck);
        }
      });
  }, []);

  /* add unit to board */
  const addToBoard = (data) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        baseboard[i][j]["name"] = data[i][j]["name"];
        baseboard[i][j]["shortname"] = data[i][j]["shortname"];
        baseboard[i][j]["position"] = [i, j];
        baseboard[i][j]["symbol"] = data[i][j]["symbol"];
        baseboard[i][j]["player"] = data[i][j]["player"];
        baseboard[i][j]["valid_moves"] = data[i][j]["valid_moves"];
      }
    }
    setBoard(baseboard);
  };

  /* sends moves to server */
  const onClick = (position) => {
    if (moves.length == 1) {
      const sendMoves = [...moves, position];
      const name = user.username;
      socketio.emit("message", sendMoves[0], sendMoves[1], room, name);
      setMoves([]);
      setValidMoves([]);
    } else {
      if (board[position[0]][position[1]].name) {
        setValidMoves(board[position[0]][position[1]].valid_moves);
        setMoves([position]);
      }
    }
  };

  return (
    <>
      <h1 className="turnAnnounce">{player}'s Turn to Move!</h1>
      <div className="gameboard">
        {board.map((line) =>
          line.map((square) => (
            <div
              className={`square bg-${square.color} ${
                validMoves.some(
                  (move) =>
                    move[0] === square.position[0] &&
                    move[1] === square.position[1]
                ) && "valid"
              }`}
              onClick={() => onClick(square.position)}
            >
              <Piece
                name={square.symbol}
                player={square.player}
                piece={square.name}
              />
            </div>
          ))
        )}
      </div>

      {inCheck == "Checkmate!" && (
        <div className="endCard">
          {user.username == player ? <h1>You Lost!</h1> : <h1>"You Won!"</h1>}
          <button className="again" onClick={() => setRoom(null)}>
            Find Another Game
          </button>
        </div>
      )}
      <h1 className="turnAnnounce">{inCheck}</h1>
    </>
  );
};

export default Board;
