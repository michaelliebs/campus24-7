import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // assuming this gives user._id
import "../stylesheets/EventDetails.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isOwner = event?.host?._id === user?._id;

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/${id}`, { withCredentials: true });
      setEvent(res.data);
    } catch (err) {
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const toggleInterested = async () => {
    try {
      const res = await axios.post(`${API_URL}/events/${id}/interested`, {}, { withCredentials: true });
      setEvent(res.data);
    } catch (err) {
      console.error("Error toggling interest:", err);
    }
  };

  const toggleAttending = async () => {
    try {
      const res = await axios.post(`${API_URL}/events/${id}/attending`, {}, { withCredentials: true });
      setEvent(res.data);
    } catch (err) {
      console.error("Error toggling attending:", err);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;

  const isInterested = event.interested?.some((u: any) =>
        typeof u === "string" ? u === user?._id : u._id?.toString() === user?._id
    );

    const isAttending = event.attendees?.some((u: any) =>
        typeof u === "string" ? u === user?._id : u._id?.toString() === user?._id
    );

  return (
    <main className="event-details">
      <h1>{event.title}</h1>
      <p>
        Hosted by{" "}
        <a href={`/profile/${event.host?._id || ""}`}>{event.host?.name}</a>
      </p>
      <p>
        📅 {new Date(event.date).toLocaleDateString()} at {event.time}
      </p>
      <p>📍 {event.location}</p>
      <p>{event.description}</p>

      <section className="details-meta">
        <div>🎟️ {event.attendees?.length || 0} going</div>
        <div>👀 {event.interested?.length || 0} interested</div>
        <div>💬 {event.comments?.length || 0} comments</div>
      </section>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={toggleAttending} className={isAttending ? "active" : ""}>
          {isAttending ? "✅ Attending" : "🎟️ Mark as Attending"}
        </button>
        <button onClick={toggleInterested} className={isInterested ? "active" : ""}>
          {isInterested ? "⭐ Interested" : "👀 Mark as Interested"}
        </button>
      </div>

      {event.tags && (
        <div className="tags">
          {event.tags.map((tag: string, i: number) => (
            <span key={i} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
      {isOwner && (
            <div style={{ marginTop: "1rem" }}>
                <button
                onClick={() => navigate(`/events/edit/${event._id}`)}
                className="edit-btn"
                >
                ✏️ Edit Event
                </button>
                <button
                onClick={async () => {
                    if (!confirm("Are you sure you want to delete this event?")) return;
                    try {
                    await axios.delete(`${API_URL}/events/delete/${event._id}`, { withCredentials: true });
                    alert("Event deleted!");
                    navigate("/home");
                    } catch (err) {
                    console.error(err);
                    alert("Failed to delete event");
                    }
                }}
                className="delete-btn"
                style={{ marginLeft: "10px" }}
                >
                🗑️ Delete Event
                </button>
            </div>
            )}

    </main>
  );
};

export default EventDetails;
