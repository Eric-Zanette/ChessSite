import { useState } from "react";
import { Link } from "react-router-dom";

const RegistrationForm = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify({ ...input }));
    fetch("http://localhost:5000/register", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...input }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
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
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="inputcotainer">
            <p>Email</p>
            <input
              type="text"
              value={input.email}
              name="email"
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="inputcotainer">
            <p>Password</p>
            <input
              type="password"
              value={input.password}
              name="password"
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="inputcotainer">
            <p>Repeat Password</p>
            <input
              type="password"
              value={input.password2}
              name="password2"
              onChange={(e) => onChange(e)}
            />
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
