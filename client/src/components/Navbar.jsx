import { Link } from "react-router-dom";

const Navbar = () => {
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
            <Link to={"/login"}>Login</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
