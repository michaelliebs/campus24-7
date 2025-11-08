import { useState } from "react";
import { signup } from "../api/auth";
import type { IUserSignup } from "../types/user";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState<IUserSignup>({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await signup(formData);
    setSuccess(true);
    setError(null);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || "Signup failed");
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Signup failed");
    }
    setSuccess(false);
  }
};


  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Sign Up</h2>
      {success && <p style={{ color: "green" }}>Account created successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
