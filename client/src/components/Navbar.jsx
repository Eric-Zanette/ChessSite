import { Link } from "react-router-dom";
import UsersContext from "../context/Users";
import { useContext, useEffect, useState, useRef } from "react";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const { user, logout } = useContext(UsersContext);
  const menuRef = useRef(null);

  const onClick = (e) => {
    e.preventDefault();
    setToggle(!toggle);
    console.log(toggle);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav>
      <div className="navContainer">
        <div className="logo">
          <h1>
            <Link to={"/"}>Chesster</Link>
          </h1>
        </div>

        <div
          className={`barsDiv ${toggle == true && "mediaOff"}`}
          onClick={(e) => onClick(e)}
        >
          <FaBars></FaBars>
        </div>

        <ul
          ref={menuRef}
          className={`navLinks ${toggle == false && "mediaOff"}`}
        >
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
