import { useContext, useEffect } from "react";
import LoginForm from "../components/LoginForm";
import UsersContext from "../context/Users";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { user } = useContext(UsersContext);

  const navigate = useNavigate();

  useEffect(() => {
    user && navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;
