import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsersContext from "../context/Users";

const RegistrationForm = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();

  const { register } = useContext(UsersContext);

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await register(input);
    success === true ? navigate("/login") : setErrors({ ...success });
  };

  return (
    <div className="container">
      <div className="registerContainer">
        <h1>Register for Chess!</h1>
        <form className="registerForm" action="" onSubmit={(e) => onSubmit(e)}>
          <div className="inputcotainer">
            <p>Username</p>
            <input
              type="text"
              value={input.username}
              name="username"
              className={errors.username && "invalid"}
              onChange={(e) => onChange(e)}
            />
            <p
              className="invalidText"
              style={{ display: errors.username ? "block" : "none" }}
            >
              {errors.username}
            </p>
          </div>
          <div className="inputcotainer">
            <p>Email</p>
            <input
              type="text"
              value={input.email}
              name="email"
              className={errors.email && "invalid"}
              onChange={(e) => onChange(e)}
            />
            <p
              className="invalidText"
              style={{ display: errors.email ? "block" : "none" }}
            >
              {errors.email}
            </p>
          </div>
          <div className="inputcotainer">
            <p>Password</p>
            <input
              type="password"
              value={input.password}
              name="password"
              className={errors.password && "invalid"}
              onChange={(e) => onChange(e)}
            />
            <p
              className="invalidText"
              style={{ display: errors.password ? "block" : "none" }}
            >
              {errors.password}
            </p>
          </div>
          <div className="inputcotainer">
            <p>Repeat Password</p>
            <input
              type="password"
              value={input.password2}
              name="password2"
              className={errors.password2 && "invalid"}
              onChange={(e) => onChange(e)}
            />
            <p
              className="invalidText"
              style={{ display: errors.password2 ? "block" : "none" }}
            >
              {errors.password2}
            </p>
          </div>
          <div className="buttons">
            <button>Register</button>
            <Link to={"/login"}>Login Instead</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
