import { useContext, useState, useEffect } from "react";
import UsersContext from "../context/Users";

const ProfileGameList = () => {
  const [games, setGames] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UsersContext);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/games", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGames(data);
        setIsLoading(false);
      });
  }, []);

  const win_count = (games) => {
    return games.filter((game) => game.winner === user.id).length;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!games) {
    return <p>No Games</p>;
  }

  return (
    <>
      <div className="playedSumamry">
        <p>Games Played: {games.length}</p>
        <p>Games Won: {win_count(games)}</p>
      </div>
      <div className="gameListContainer">
        <h1>Match History</h1>
        <div className="gameList">
          <div className="row">
            <div className="rowElement header">Name</div>
            <div className="rowElement header">White</div>
            <div className="rowElement header">Black</div>
            <div className="rowElement header">Winner</div>
          </div>
          {games.map((game) => (
            <div className="row">
              <div className="rowElement">{game.name}</div>
              <div className="rowElement">{game.white}</div>
              <div className="rowElement">{game.black}</div>
              <div className="rowElement">
                {user.username === game.winner ? (
                  <div className="win">Won</div>
                ) : (
                  <div className="lose">Lost</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileGameList;
