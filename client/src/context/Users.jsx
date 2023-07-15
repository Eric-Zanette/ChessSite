import React from "react";
import { useState, createContext, useEffect } from "react";

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [user, setUser] = useState();
  useEffect(() => {
    get_user();
  }, []);

  const login = (input) => {
    return fetch("http://localhost:5000/login", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...input }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          get_user();
          return true;
        } else {
          return data;
        }
      });
  };

  const register = (input) => {
    return fetch("http://localhost:5000/register", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...input }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        return data.msg === "Success!" ? true : data;
      });
  };

  const get_user = () => {
    const token = localStorage.getItem("token");

    return fetch("http://localhost:5000/user", {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.username &&
          setUser({ username: data.username, email: data.email });
      });
  };

  return (
    <UsersContext.Provider
      value={{
        user,
        login,
        register,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export default UsersContext;
