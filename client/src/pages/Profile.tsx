import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../stylesheets/Profile.css";

interface Event {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed";
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  major?: string;
  status?: string;
  eventsHosted: Event[];
  eventsAttending: Event[];
}

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const { logout: contextLogout, user: currentUser } = useAuth();
  const { id } = useParams(); // For `/profile/:id` route
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    major: "",
    status: "",
  });

  const isOwnProfile = currentUser?._id === id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/${id}`, { withCredentials: true });
        setUser(res.data.user);
        setForm({
          name: res.data.user.name || "",
          bio: res.data.user.bio || "",
          major: res.data.user.major || "",
          status: res.data.user.status || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [API_URL, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(`${API_URL}/users/me`, form, { withCredentials: true });
      setUser(res.data.user);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleDelete = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete your profile? This action cannot be undone."
  );
  if (!confirmed) return;

  try {
    await axios.delete(`${API_URL}/users/me`, { withCredentials: true });
    // Clear user in context and redirect
    await contextLogout(); 
    // After deletion, redirect to login page
    navigate("/login");
  } catch (err) {
    console.error("Failed to delete profile:", err);
  }
};


  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="profile-container" style={{marginTop: "var(--header-height)"}}>
      <h1>Profile</h1>

      {/* Basic Info */}
      <div>
        {editMode ? (
          <>
            <label>
              Name: <input name="name" value={form.name} onChange={handleChange} />
            </label>
            <label>
              Bio: <textarea name="bio" value={form.bio} onChange={handleChange} />
            </label>
            <label>
              Major: <input name="major" value={form.major} onChange={handleChange} />
            </label>
            <label>
              Status: <input name="status" value={form.status} onChange={handleChange} />
            </label>
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="delete-btn" onClick={handleDelete}>Delete Profile</button>

          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            {user.bio && <p><strong>Bio:</strong> {user.bio}</p>}
            {user.major && <p><strong>Major:</strong> {user.major}</p>}
            {user.status && <p><strong>Status:</strong> {user.status}</p>}
            {isOwnProfile && <button onClick={() => setEditMode(true)}>Edit Profile</button>}
          </>
        )}
      </div>

      {/* Events Hosted */}
      <div>
        <h2>Events Hosted</h2>
        {user.eventsHosted.length === 0 ? (
          <p>No events hosted yet.</p>
        ) : (
          <ul>
            {user.eventsHosted.map((event) => (
              <li key={event._id}>
                <span>{event.title}</span> - <span>{event.date} {event.time}</span> -{" "}
                <span className="status-dot" style={{backgroundColor: getStatusColor(event.status)}}></span>
                <span>{event.status}</span>

              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Events Attending */}
      <div>
        <h2>Events Attending</h2>
        {user.eventsAttending.length === 0 ? (
          <p>Not attending any events.</p>
        ) : (
          <ul>
            {user.eventsAttending.map((event) => (
              <li key={event._id}>
                <span>{event.title}</span> - <span>{event.date} {event.time}</span> -{" "}
                <span className="status-dot" style={{backgroundColor: getStatusColor(event.status)}}></span>
                <span>{event.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Helper function for color indicators
function getStatusColor(status: string) {
  switch (status) {
    case "upcoming":
      return "green";
    case "ongoing":
      return "orange";
    case "completed":
      return "gray";
    default:
      return "black";
  }
}

export default Profile;
