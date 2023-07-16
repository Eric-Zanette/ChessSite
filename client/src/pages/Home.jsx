import { useContext } from "react";
import UsersContext from "../context/Users";

const Home = () => {
  const { user, isLoading } = useContext(UsersContext);

  if (isLoading) {
    return (
      <div className="profileContainer">
        <h1>Loading!</h1>
      </div>
    );
  }

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
