import express, { Router, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import User from "../models/Users";
import { getUsers } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);

router.post('/signup', async (req: Request, res: Response) => {
  console.log("POST /api/users/register hit", req.body);
  const { name, email, password, bio, major, status } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await User.create({
      name,
      email,
      password: hashedPassword,
      bio,
      major,
      status,
      isAdmin: false,
    });

    const { password: _, ...safeUser } = savedUser.toObject();

    return res.status(201).json(safeUser);
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Failed to log in' });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // find user by email (case-insensitive)
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

export default router;
