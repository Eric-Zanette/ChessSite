import React from "react";
import { useState, useEffect } from "react";
import Board from "../components/Board";
import RoomForm from "../components/RoomForm";

const GameRoom = () => {
  const [room, setRoom] = useState();

  return (
    <div className="gameRoom">
      <div className="gameArea">
        {room ? <Board /> : <RoomForm setRoom={setRoom} />}
      </div>
    </div>
  );
};

export default GameRoom;
