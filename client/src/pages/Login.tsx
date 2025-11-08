import { useState } from "react";
import type { IUserLogin } from "../types/user";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/Login.css";

const Login = () => {
  const [formData, setFormData] = useState<IUserLogin>({
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const data = await login(formData.email, formData.password);
    console.log("Logged in user:", data);
    setError(null);

    navigate("/home", { replace: true });


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
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
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

      <p className="switch-auth">
        Don’t have an account?{" "}
        <Link to="/signup" className="auth-link">
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default Login;
