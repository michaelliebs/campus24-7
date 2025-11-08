import { Router, Request, Response } from 'express';
import Event, { IEvent } from "../models/Events";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";
import { getEvents } from "../controllers/eventController";
import { Document } from 'mongoose';

const router = Router();

router.get("/", getEvents);

router.post('/create', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, description, date, time, location, email, phone } = req.body;
  if (!title || !description || !date || !time || !location) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!req.user?.userId) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {

    const eventDateTime = new Date(`${date}T${time}:00`);

    if (isNaN(eventDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    const newEvent = await Event.create({
      title,
      description,
      date: eventDateTime,
      time,
      location,
      host: req.user!.userId,
      phone,
      email,
      attendees: [req.user!.userId],
    });

    return res.status(201).json({ message: "Event successfully created", event: newEvent });
  } catch (err) {
    console.error("Error during event creation:", err);
    return res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;