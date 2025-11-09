import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/EventComments.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface CommentType {
  _id: string;
  content: string;
  user: { _id: string; name: string };
  reply?: CommentType;
  createdAt: string;
}

function EventComments({ eventId, eventHostId }: { eventId: string; eventHostId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${eventId}`, { withCredentials: true });
        const sortedComments = res.data.comments.sort(
          (a: CommentType, b: CommentType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setComments(sortedComments);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadComments();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/comments/create`,
        { content: newComment, event: eventId },
        { withCredentials: true }
      );
      setComments([res.data.comment, ...comments]);
      setNewComment("");
      setStartIndex(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId: string, isReply = false) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axios.delete(`${API_URL}/comments/delete/${commentId}`, { withCredentials: true });
      setComments(prev =>
        prev
          .map(c => {
            if (!isReply && c._id === commentId) return null;
            if (isReply && c.reply?._id === commentId) return { ...c, reply: undefined };
            return c;
          })
          .filter(Boolean) as CommentType[]
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (parentId: string, replyContent: string) => {
    if (!replyContent.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/comments/${parentId}/reply`,
        { content: replyContent },
        { withCredentials: true }
      );

      const newReply = res.data.comment.replies?.[res.data.comment.replies.length - 1];
      if (!newReply) return;

      setComments(prev => prev.map(c => (c._id === parentId ? { ...c, reply: newReply } : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => setStartIndex(prev => (prev + 3 >= comments.length ? 0 : prev + 3));
  const handlePrev = () => setStartIndex(prev => Math.max(prev - 3, 0));

  if (loading) return <p className="ec-loading">Loading comments...</p>;

  const paginatedComments = comments.slice(startIndex, startIndex + 3);

  return (
    <section className="ec-container">
      <h3 className="ec-title">Comments</h3>

      {user?._id && (
        <form onSubmit={handleSubmit} className="ec-form">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="ec-input"
          />
          <button type="submit" className="ec-submit">Post</button>
        </form>
      )}

      {paginatedComments.length === 0 ? (
        <p className="ec-no-comments">No comments yet.</p>
      ) : (
        <ul className="ec-list">
          {paginatedComments.map(c => (
            <li key={c._id} className="ec-item">
              <div className="ec-main">
                <div className="ec-text">
                  <p className="ec-author">{c.user.name}</p>
                  <p className="ec-content">{c.content}</p>
                  <small className="ec-date">{new Date(c.createdAt).toLocaleString()}</small>
                </div>
                {user?._id === c.user._id && (
                  <span className="ec-delete" onClick={() => handleDelete(c._id)}>🗑️</span>
                )}
              </div>

              {c.reply ? (
                <div className="ec-reply">
                  <p className="ec-reply-author">{c.reply.user.name}</p>
                  <p className="ec-reply-content">{c.reply.content}</p>
                  <small className="ec-reply-date">{new Date(c.reply.createdAt).toLocaleString()}</small>
                  {user?._id === eventHostId && (
                    <span className="ec-delete" onClick={() => handleDelete(c.reply._id, true)}>🗑️</span>
                  )}
                </div>
              ) : (
                user?._id === eventHostId && <ReplyInput onSubmit={content => handleReply(c._id, content)} />
              )}
            </li>
          ))}
        </ul>
      )}

      {comments.length > 3 && (
        <div className="ec-pagination">
          <button onClick={handlePrev} disabled={startIndex === 0}>Prev</button>
          <button onClick={handleNext} disabled={startIndex + 3 >= comments.length}>Next</button>
        </div>
      )}
    </section>
  );
}

function ReplyInput({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [reply, setReply] = useState("");

  return (
    <form
      onSubmit={e => { e.preventDefault(); if (reply.trim()) onSubmit(reply); setReply(""); }}
      className="ec-reply-form"
    >
      <input
        type="text"
        value={reply}
        onChange={e => setReply(e.target.value)}
        placeholder="Write a reply..."
        className="ec-reply-input"
      />
      <button type="submit" className="ec-reply-submit">Reply</button>
    </form>
  );
}

export default EventComments;
