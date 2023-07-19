import { Link } from "react-router-dom";
import UsersContext from "../context/Users";
import { useContext } from "react";

const Navbar = () => {
  const { user, logout } = useContext(UsersContext);

  return (
    <nav>
      <div className="navContainer">
        <div className="logo">
          <img src="../images/chess-39293.png" alt="" />
          <h1>
            <Link to={"/"}>Chesster</Link>
          </h1>
        </div>
        <ul className="navLinks">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/game"}>Play a Game</Link>
          </li>
          <li>
            {user ? (
              <Link to={"/"} onClick={logout}>
                Logout
              </Link>
            ) : (
              <Link to={"/login"}>Login</Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
