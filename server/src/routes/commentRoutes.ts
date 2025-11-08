import { Router, Response } from 'express';
import Comment from "../models/Comments";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";
import { getComments } from "../controllers/commentController";

const router = Router();

router.get("/", getComments);

router.post('/create', requireAuth, async (req: AuthRequest, res: Response) => {
  const { content, event } = req.body;
  if (!content) {
    return res.status(400).json({ error: "Missing comment content" });
  }

  if (!req.user?.userId) {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    const newComment = await Comment.create({
      content,
      event,
      user: req.user!.userId,
    });

    return res.status(201).json({ message: "Comment successfully created", comment: newComment });
  } catch (err) {
    console.error("Error creating comment");
    return res.status(500).json({ error: "Failed to create comment" });
  }
});

router.delete('/delete/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment successfully deleted", event: deletedComment });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
})

export default router;