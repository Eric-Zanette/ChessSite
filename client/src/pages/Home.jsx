import { useContext } from "react";
import UsersContext from "../context/Users";

const Home = () => {
  const { user } = useContext(UsersContext);

  if (user) {
    return (
      <div className="profileContainer">
        <h1>{user.username}</h1>
      </div>
    );
  }

  return (
    <div className="profileContainer">
      <h1>Sign in to See Profile!</h1>
    </div>
  );
};

export default Home;
