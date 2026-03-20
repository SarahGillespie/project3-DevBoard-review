import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "./Login.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function Login({ onSwitchToRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          login(data);
        }
      })
      .catch(() => setError("Something went wrong. Please try again."));
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login to DevBoard</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account?{" "}
          <button onClick={onSwitchToRegister}>Register</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
