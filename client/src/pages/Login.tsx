import { useState } from "react";
import { login } from "../api/auth";
import type { IUserLogin } from "../types/user";
import axios from "axios";
import "../stylesheets/Login.css";

const Login = () => {
  const [formData, setFormData] = useState<IUserLogin>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = await login(formData);
    console.log("Logged in user:", data);
    setError(null);
    // Save token to localStorage or context
    localStorage.setItem("token", data.token);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || "Login failed");
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Login failed");
    }
  }
};

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="login-message">{error}</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
