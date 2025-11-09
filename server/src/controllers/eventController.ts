import { Request, Response } from "express";
import Event from "../models/Events";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find()
      .populate("host", "name email")
      .populate("attendees", "name email")
      .populate("interested", "name email")
      .populate({
        path: "comments",
        select: "content user createdAt replies",
        populate: [
          { path: "user", select: "name" },
          {
            path: "replies",
            select: "content user createdAt",
            populate: { path: "user", select: "name" },
          },
        ],
      })
      .sort({ date: 1 });

    res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Server error" });
  }
};

