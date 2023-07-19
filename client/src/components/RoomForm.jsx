import React from "react";
import { useState, useContext } from "react";
import UsersContext from "../context/Users";

const RoomForm = ({ setRoom }) => {
  const [input, setInput] = useState({
    join: "",
    create: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    join: "",
    create: "",
  });

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const { user, isLoading } = useContext(UsersContext);

  const onSubmit = (e) => {
    e.preventDefault();
    const boardName = input[e.target.name];
    fetch("/api/match", {
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
        setRoom(data.room);
        setErrors(data);
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Sign in to Play a Game</p>;
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
            className={errors.join && "invalid"}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button name="join">Join</button>
      </form>
      <p
        className="invalidText"
        style={{ display: errors.join ? "block" : "none" }}
      >
        {errors.join}
      </p>
      <form name="create" onSubmit={(e) => onSubmit(e)}>
        <div className="line">
          <h2>Create a New Game</h2>
          <input
            placeholder="Game Name"
            name="create"
            value={input.create}
            className={errors.create && "invalid"}
            onChange={(e) => onChange(e)}
          />
        </div>
        <button name="create">Create</button>
      </form>
      <p
        className="invalidText"
        style={{ display: errors.create ? "block" : "none" }}
      >
        {errors.create}
      </p>
    </div>
  );
};

export default RoomForm;
