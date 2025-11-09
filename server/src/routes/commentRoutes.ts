import { Router, Response } from "express";
import Comment from "../models/Comments";
import Event from "../models/Events";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

const router = Router();

// GET all comments (optional)
router.get("/", async (req: any, res: Response) => {
  try {
    const comments = await Comment.find()
      .populate("user", "name _id")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name _id" },
      });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST /comments/create
router.post("/create", requireAuth, async (req: AuthRequest, res: Response) => {
  const { content, event } = req.body;
  if (!content) return res.status(400).json({ error: "Missing comment content" });

  try {
    // 1. Create the comment
    const newComment = await Comment.create({
      content,
      event,
      user: req.user!.userId,
      replies: [],
    });

    // 2. Push the comment into the Event's comments array
    await Event.findByIdAndUpdate(event, {
      $push: { comments: newComment._id },
    });

    // 3. Return the comment with populated user info
    const populatedComment = await Comment.findById(newComment._id).populate("user", "name _id");

    res.status(201).json({ message: "Comment successfully created", comment: populatedComment });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});


// DELETE /comments/delete/:id
router.delete("/delete/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) return res.status(404).json({ error: "Comment not found" });

    res.status(200).json({ message: "Comment successfully deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// POST /comments/:id/reply  (only event host can reply)
router.post("/:id/reply", requireAuth, async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const { id } = req.params;

  if (!content) return res.status(400).json({ error: "Missing reply content" });

  try {
    const parentComment = await Comment.findById(id).populate("event", "_id host");
    if (!parentComment) return res.status(404).json({ error: "Parent comment not found" });

    const event = parentComment.event as any; // populated
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Only event host can reply
    if (event.host.toString() !== req.user!.userId) {
      return res.status(403).json({ error: "Only the event host can reply" });
    }

    const reply = await Comment.create({
      content,
      event: event._id,
      user: req.user!.userId,
      replies: [],
    });

    parentComment.replies.push(reply._id as mongoose.Types.ObjectId);
    await parentComment.save();

    const updatedComment = await Comment.findById(id)
      .populate("user", "name _id")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name _id" },
      });

    res.status(201).json({ message: "Reply added", comment: updatedComment });
  } catch (err) {
    console.error("Error creating reply:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
