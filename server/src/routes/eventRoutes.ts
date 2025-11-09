import { Router, Response } from 'express';
import Event from "../models/Events";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";
import { getEvents } from "../controllers/eventController";
import mongoose from 'mongoose';
import User from '../models/Users';

const router = Router();

router.get("/", getEvents);

router.post('/create', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, description, date, time, location, host, email, phone, status, tags } = req.body;
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
      attendees: [req.user!.userId],
      interested: [],
      comments: [],
      phone,
      email,
      tags,
    });
    // After creating the event
    await User.findByIdAndUpdate(req.user!.userId, {
      $addToSet: {
        eventsHosted: newEvent._id, // add the event to the user's hosted events
        eventsAttending: newEvent._id // add the event to the user's attending events
      }
    });


    return res.status(201).json({ message: "Event successfully created", event: newEvent });
  } catch (err) {
    console.error("Error during event creation:", err);
    return res.status(500).json({ error: "Failed to create event" });
  }
});

router.put('/edit/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event successfully updated", event: updatedEvent });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

router.delete('/delete/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ message: "Event successfully deleted", event: deletedEvent });
  } catch(err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Get single event by ID
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("host", "name _id")
      .populate("attendees", "name _id")
      .populate("interested", "name _id")
      .populate("comments");

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:id/interested", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({ error: "Event or user not found" });
    }

    const isInterested = event.interested.some(
      (interested) => interested.toString() === userId
    );

    if (isInterested) {
      event.interested = event.interested.filter(
        (interested) => interested.toString() !== userId
      );
      user.eventsInterested = user.eventsInterested?.filter(
        (eid) => eid.toString() !== eventId
      );
    } else {
      event.interested.push(new mongoose.Types.ObjectId(userId));
      user.eventsInterested = user.eventsInterested || [];
      user.eventsInterested.push(new mongoose.Types.ObjectId(eventId));
    }

    await event.save();
    await user.save();

    const updatedEvent = await Event.findById(eventId)
      .populate("host", "name _id")
      .populate("attendees", "name _id")
      .populate("interested", "name _id")
      .populate("comments");

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error toggling interest:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/:id/attending", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isAttending = event.attendees.some(a => a.toString() === userId);

    if (isAttending) {
      await Promise.all([
        Event.findByIdAndUpdate(eventId, { $pull: { attendees: userId } }),
        User.findByIdAndUpdate(userId, { $pull: { eventsAttending: eventId } }),
      ]);
    } else {
      await Promise.all([
        Event.findByIdAndUpdate(eventId, { $addToSet: { attendees: userId } }),
        User.findByIdAndUpdate(userId, { $addToSet: { eventsAttending: eventId } }),
      ]);
    }

    const updatedEvent = await Event.findById(eventId)
      .populate("host", "name _id")
      .populate("attendees", "name _id")
      .populate("interested", "name _id")
      .populate("comments");

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Error toggling attending:", err);
    res.status(500).json({ error: "Server error" });
  }
});





export default router;