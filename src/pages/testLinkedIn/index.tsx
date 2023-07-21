import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginAction = async () => {
    try {
      const response = await axios.post(`/api/integration/linkedin`, {
        email,
        password,
      });
      const result = response.data;
      // Handle successful login here, e.g., redirect to the user's profile page.
      console.log("Login successful!");
    } catch (error) {
      console.error(error);
      // Handle login error here.
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button onClick={handleLoginAction}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
