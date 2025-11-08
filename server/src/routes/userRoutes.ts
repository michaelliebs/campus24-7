import { Router, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User, { IUser } from "../models/Users";
import { getUsers } from "../controllers/userController";
import { Document } from 'mongoose';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const isProd = process.env.NODE_ENV === "production";

if (!JWT_SECRET) {
  throw new Error('JWT secret missing in .env');
}

const TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

function signToken(user: IUser & Document<any>) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
    },
    JWT_SECRET as string,
    { expiresIn: "2h" }
  );
}

function setAuthCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: TOKEN_MAX_AGE_MS,
    path: "/",
  });
}

function clearAuthCookie(res: Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

router.get("/", getUsers);

router.get("/me", requireAuth, async (req: Request, res: Response) => {
  const authReq = req as any; // cast to include user
  try {
    const user = await User.findById(authReq.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, bio, major, status } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }] });
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

    const token = signToken(savedUser as IUser & Document);
    setAuthCookie(res, token);

    const { password: _, ...safeUser } = savedUser.toObject();

    return res.status(201).json({ message: "Signup successful", user: safeUser, });
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ error: 'Failed to log in' });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    // find user by email (case-insensitive)
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signToken(user as IUser & Document);
    setAuthCookie(res, token);

    const { password: _pw, ...safeUser } = user.toObject();
    console.log(res.getHeaders());

    return res.status(200).json({
      message: "Login successful",
      user: {
        user: safeUser,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.status(200).json({ message: "Logged out" });
});

export default router;
