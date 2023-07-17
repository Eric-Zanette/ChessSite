import React from "react";
import { useState } from "react";
import Board from "../components/Board";
import RoomForm from "../components/RoomForm";
import GameList from "../components/GameList";

const GameRoom = () => {
  const [room, setRoom] = useState();

  return (
    <div className="gameRoom">
      <div className="gameArea">
        {room ? <Board room={room} /> : <RoomForm setRoom={setRoom} />}
      </div>
      {room ? "" : <GameList setRoom={setRoom} />}
    </div>
  );
};

export default GameRoom;
