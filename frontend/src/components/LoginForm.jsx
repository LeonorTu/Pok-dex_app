import React from "react";
import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom"; // for redirecting to profile page
import AuthContext from "../AuthContext"; // for checking if user is authenticated

const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  //const [user, setUser] = useState([]);
  const [password, setPassword] = useState("");
  const [pwordVisibility, setPwordVisibility] = useState(false);

  const { setIsAuthenticated, setUser } = useContext(AuthContext); // Get auth state from context
  const navigate = useNavigate(); // direct to profile page after login

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const loginAttempt = (event) => {
    event.preventDefault();
    const userInfo = {
      username: username,
      password: password,
    };
    fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("User login data:", data);
          setIsAuthenticated(true); // Set authenticated state to true
          setUser(data.user); // Set user state to the response
          navigate("/profile"); // Redirect to profile page
        }
      })
      .catch((error) => alert(error.message));
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  return (
    <section className="">
      <header className="w-28 mx-auto mb-5 font-bold text-pink-950 text-5xl">
        Login
      </header>
      <form onSubmit={loginAttempt}>
        <div>
          <label className="block mb-2 text-black" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            autoComplete="on"
            className="w-full p-2 mb-6 text-pink-700 border-b-2 border-pink-700 outline-none focus:bg-gray-300"
            value={username}
            onChange={handleUsername}
          />
        </div>
        <div>
          <label className="block mb-2 text-black" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            autoComplete="on"
            className="w-full p-2 mb-6 text-pink-700 border-b-2 border-pink-700 outline-none focus:bg-gray-300"
            type={pwordVisibility ? "text" : "password"}
            value={password}
            onChange={handlePassword}
          />
          <div>
            <label htmlFor="show-password">Show password? </label>
            <input
              id="show-password"
              type="checkbox"
              value={pwordVisibility}
              onChange={() => setPwordVisibility((previous) => !previous)}
            />
          </div>
        </div>
        <button
          className="w-full text-2xl bg-pink-700 hover:bg-pink-950 text-white font-bold my-3 py-2 px-4 mb-6 rounded"
          type="submit"
        >
          Log in
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
