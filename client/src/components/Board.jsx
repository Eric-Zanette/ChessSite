import { useEffect, useState } from "react";
import io from "socket.io-client";

const Board = () => {
  const [board, setBoard] = useState();

  useEffect(() => {}, []);

  var socketio = io("http://localhost:5000");
  socketio.emit("message", "a,1");
  socketio.on("message", (data) => {
    console.log(data);
  });

  if (!board) {
    return <div>LOADING</div>;
  }

  return (
    <div className="grid grid-cols-8">
      {board.map((item) => item.map((field) => <div>{field}</div>))}
    </div>
  );
};

export default Board;
