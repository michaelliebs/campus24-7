import { Request, Response } from "express";
import Event from "../models/Events";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
