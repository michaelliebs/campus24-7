import { useState } from "react";
import { signup } from "../api/auth";
import type { IUserSignup } from "../types/user";
import axios from "axios";
import "../stylesheets/SignUp.css";

const Signup = () => {
  const [formData, setFormData] = useState<IUserSignup>({
    name: "",
    email: "",
    password: "",
    status: "",
    major: "",
    bio: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div className="signup-container">
      <h2>Sign Up</h2>
      {success && <p style={{ color: "green" }}>Account created successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} className="signup-form">
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

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="alumni">Alumni</option>
        </select>

        <input
          type="text"
          name="major"
          placeholder="Major"
          value={formData.major}
          onChange={handleChange}
        />

        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
