import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import UsersContext from "../context/Users";

const LoginForm = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { login } = useContext(UsersContext);

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await login(input);
    console.log(success);
    success === true ? navigate("/") : setErrors({ ...success });
  };

  return (
    <div className="container">
      <div className="registerContainer">
        <h1>Login</h1>
        <form className="registerForm" action="" onSubmit={(e) => onSubmit(e)}>
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
          <div className="buttons">
            <button>Login</button>
            <Link to={"/register"}>Register Instead</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
