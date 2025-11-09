import { Request, Response } from "express";
import Comment from "../models/Events";

export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}