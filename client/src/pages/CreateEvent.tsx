import { useState } from 'react';
import '../stylesheets/CreateEvent.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type CreateEventFormData = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
};

const CreateEvent = () => {
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    tags: []
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/events/create`, formData, { withCredentials: true });
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating the event!");
    }
  };

  return (
    <main id="create-event">
      <div className="form-container">
        <h2>Create a New Event</h2>
        <p className="form-description">Fill out the details below to post your event.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input name="title" id="title" type="text" required pattern="^(?=.*\S).{1,59}$" onChange={handleChange}/>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea name="description" id="description" required onChange={handleChange} rows={5}/>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label htmlFor="date">Date</label>
              <input name="date" id="date" type="date" onChange={handleChange}/>
            </div>
            <div className="form-group half">
              <label htmlFor="time">Time</label>
              <input name="time" id="time" type="time" onChange={handleChange}/>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input name="location" id="location" type="text" required pattern="^(?=.*\S).{1,59}$" onChange={handleChange}/>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              name="tags"
              id="tags"
              type="text"
              placeholder="e.g. music, workshop, networking"
              onChange={(e) => {
                const parts = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setFormData(prev => ({ ...prev, tags: parts }));
              }}
            />
          </div>

          <button type="submit" className="submit-btn">Create Event</button>
        </form>
      </div>
    </main>
  );
};

export { CreateEvent };
