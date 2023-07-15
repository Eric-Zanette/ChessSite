import { useContext } from "react";
import UsersContext from "../context/Users";

const Home = () => {
  const { user } = useContext(UsersContext);

  if (user) {
    return <div>{user.username}</div>;
  }

  return <div>Loading!</div>;
};

export default Home;
