import { useState } from "react";
import { login } from "../api/auth";
import type { IUserLogin } from "../types/user";
import axios from "axios";

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
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
