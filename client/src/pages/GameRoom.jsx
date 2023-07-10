import React from "react";
import Board from "../components/Board";

const GameRoom = () => {
  return (
    <div className="gameRoom">
      <div className="gameArea">
        <Board />
      </div>
    </div>
  );
};

export default GameRoom;
