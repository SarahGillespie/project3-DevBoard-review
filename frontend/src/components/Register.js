import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import "./Register.css";

const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

function Register({ onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const { login } = useUser();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password, displayName }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
          })
            .then((res) => res.json())
            .then((userData) => {
              if (!userData.error) login(userData);
            });
        }
      })
      .catch(() => setError("Something went wrong. Please try again."));
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register for DevBoard</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
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
          <button type="submit">Register</button>
        </form>
        <p className="auth-switch">
          Already have an account?{" "}
          <button onClick={onSwitchToLogin}>Login</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
