import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../stylesheets/EditEvent.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    tags: [] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${id}`, { withCredentials: true });
        const e = res.data;
        setFormData({
          title: e.title || "",
          description: e.description || "",
          date: new Date(e.date).toISOString().split("T")[0],
          time: e.time || "",
          location: e.location || "",
          tags: e.tags || [],
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p className="loading">Loading event...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // === Validation ===
    if (!formData.title.trim() || !formData.description.trim() || !formData.date || !formData.time || !formData.location.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      await axios.put(`${API_URL}/events/edit/${id}`, formData, { withCredentials: true });
      alert("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <main className="edit-event-page">
      <h1>Edit Event</h1>
      <form className="edit-event-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event..."
            required
          />
        </label>

        <div className="form-row">
          <label>
            Date 
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <label>
            Time 
            <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          </label>
        </div>

        <label>
          Location 
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </label>

        <label>
          Tags (comma-separated)
          <input
            name="tags"
            value={formData.tags.join(", ")}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                tags: e.target.value.split(",").map((t) => t.trim()).filter((t) => t),
              }))
            }
            placeholder="e.g., tech, networking, workshop"
          />
        </label>

        <div className="button-group">
          <button type="submit" className="save-btn">💾 Save Changes</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(`/events/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
};

export default EditEvent;
