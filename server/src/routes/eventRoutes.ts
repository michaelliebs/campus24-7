import { Router, Request, Response } from 'express';
import Event, { IEvent } from "../models/Events";
import { getEvents } from "../controllers/eventController";
import { Document } from 'mongoose';

const router = Router();

router.post('/create', async (req: Request, res: Response) => {
  const { title, description, date, time, location, host, email, phone, status } = req.body;
  if ( !title || !description || !date || !time || !location || !host || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      location,
      host,
      phone,
      email,
      status
    });

    return res.status(201).json({ message: "Event successfully created", event: newEvent });
  } catch (err) {
    console.error("Error during event creation:", err);
    return res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;