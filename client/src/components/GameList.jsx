import { useEffect, useState } from "react";

const GameList = ({ setRoom }) => {
  const [games, setGames] = useState();

  useEffect(() => {
    fetch("/api/boards")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGames(data);
      });
  }, []);

  if (!games) {
    return <p>No Games</p>;
  }

  return (
    <div className="gameListContainer">
      <h1>Current Games</h1>
      <div className="gameList">
        <div className="row">
          <div className="rowElement header">Name</div>
          <div className="rowElement header">Created by</div>
          <div className="rowElement header">Full</div>
        </div>
        {games.map((game) => (
          <div className="row">
            <div className="rowElement">{game.name}</div>
            <div className="rowElement">{game.createdBy}</div>
            <div className="rowElement">{game.full}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
