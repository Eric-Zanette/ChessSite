import { useEffect, useState } from "react";
import io from "socket.io-client";
import Piece from "./Piece";

const Board = () => {
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

  const [board, setBoard] = useState(baseboard);
  const [moves, setMoves] = useState([]);
  const [player, setPlayer] = useState();
  const [inCheck, setInCheck] = useState();
  const [validMoves, setValidMoves] = useState([]);

  var socketio = io("http://localhost:5000");

  /* get pieces state */
  useEffect(() => {
    fetch("http://localhost:5000/board", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room: localStorage.getItem("room") }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.board != false) {
          console.log(data.player);
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
      const room = localStorage.getItem("room");
      const name = localStorage.getItem("name");
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

  /* Receives updated board state */
  socketio.on("message", (data) => {
    console.log(data);
    addToBoard(data.board);
    setPlayer(data.player);
    setInCheck(data.inCheck);
  });

  if (!board) {
    return <div>LOADING</div>;
  }

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
      <h1 className="turnAnnounce">{inCheck}</h1>
    </>
  );
};

export default Board;
