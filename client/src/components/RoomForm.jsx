import React from "react";
import { useState, useContext } from "react";
import UsersContext from "../context/Users";

const RoomForm = ({ setRoom }) => {
  const [input, setInput] = useState({
    join: "",
    create: "",
    name: "",
  });

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const { user } = useContext(UsersContext);

  const onSubmit = (e) => {
    e.preventDefault();
    const boardName = input[e.target.name];
    fetch("http://localhost:5000/match", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [e.target.name]: boardName, name: user.username }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.room);
        setRoom(data.room);
        localStorage.setItem("room", data.room);
        localStorage.setItem("name", data.name);
      });
  };

  if (!user) {
    return <p>LOADING</p>;
  }

  return (
    <div className="formsContainer">
      <div className="nameContainer">
        <h1 className="nameHeader">Name: {user.username}</h1>
      </div>

      <h1>Play a Game!</h1>
      <form name="join" onSubmit={(e) => onSubmit(e)}>
        <div className="line">
          <h2>Join Existing Game Room</h2>
          <input
            placeholder="Game Name"
            name="join"
            value={input.join}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button name="join">Join</button>
      </form>
      <form name="create" onSubmit={(e) => onSubmit(e)}>
        <div className="line">
          <h2>Create a New Game</h2>
          <input
            placeholder="Game Name"
            name="create"
            value={input.create}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button name="create">Create</button>
      </form>
    </div>
  );
};

export default RoomForm;
