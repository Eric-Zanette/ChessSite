import RegistrationForm from "../components/RegistrationForm";
import { useEffect, useContext } from "react";
import UsersContext from "../context/Users";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { user } = useContext(UsersContext);

  const navigate = useNavigate();

  useEffect(() => {
    user && navigate("/");
  }, [user, navigate]);

  return (
    <div>
      <RegistrationForm />
    </div>
  );
};

export default Register;
