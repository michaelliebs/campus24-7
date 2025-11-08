import axios from "axios";
import type { IUserLogin, IUserSignup } from "../types/user";

const API_URL = "http://localhost:5000/api/users"; // adjust if different

export const signup = async (userData: IUserSignup) => {
  const res = await axios.post(`${API_URL}/signup`, userData);
  return res.data;
};

export const login = async (loginData: IUserLogin) => {
  const res = await axios.post(`${API_URL}/login`, loginData);
  return res.data;
};
