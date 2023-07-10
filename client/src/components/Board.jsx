import { useEffect, useState } from "react";
import io from "socket.io-client";
import Piece from "./Piece";

const Board = () => {
  const [board, setBoard] = useState([]);

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

  /* get pieces state */
  useEffect(() => {
    fetch("http://localhost:5000/board")
      .then((res) => res.json())
      .then((data) => {
        addToBoard(data);
      });
  }, []);

  /* add unit to board */
  const addToBoard = (data) => {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        baseboard[i][j]["name"] = data[i][j]["name"];
        baseboard[i][j]["shortname"] = data[i][j]["shortname"];
        baseboard[i][j]["position"] = data[i][j]["position"];
        baseboard[i][j]["symbol"] = data[i][j]["symbol"];
        baseboard[i][j]["player"] = data[i][j]["player"];
      }
    }
    console.log(baseboard);
    setBoard(baseboard);
    console.log(board);
  };

  const onClick = (position) => {
    /* socketio.emit("message", position) */
    console.log(position);
  };

  /*   var socketio = io("http://localhost:5000");
  socketio.on("message", (data) => {
    console.log(data);
  }); */

  if (!board) {
    return <div>LOADING</div>;
  }

  return (
    <div className="gameboard">
      {board.map((line) =>
        line.map((square) => (
          <div
            className={`square bg-${square.color}`}
            onClick={() => onClick(square)}
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
  );
};

export default Board;
