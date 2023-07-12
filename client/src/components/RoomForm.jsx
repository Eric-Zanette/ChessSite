import React from "react";
import { useState } from "react";

const RoomForm = () => {
  const [input, setInput] = useState();

  return (
    <>
      <h1>Play a Game!</h1>
      <form>
        <div className="formLine">
          <div className="line">
            <h2>Join Existing Game Room</h2>
            <input placeholder="Game Name" />
          </div>
          <button>Join</button>
        </div>
        <div className="formLine">
          <div className="line">
            <h2>Create a New Game</h2>
            <input placeholder="Game Name" />
          </div>
          <button>Create</button>
        </div>
      </form>
    </>
  );
};

export default RoomForm;
