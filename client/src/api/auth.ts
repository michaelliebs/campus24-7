import axios from "axios";
import type { IUserLogin, IUserSignup } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const signup = async (userData: IUserSignup) => {
  const res = await axios.post(`${API_URL}/users/signup`, userData, {
    withCredentials: true,
  });
  return res.data;
};

export const login = async (loginData: IUserLogin) => {
  const res = await axios.post(`${API_URL}/users/login`, loginData, {
    withCredentials: true,
  });
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API_URL}/users/logout`, {}, {
    withCredentials: true,
  });
  return res.data;
};
