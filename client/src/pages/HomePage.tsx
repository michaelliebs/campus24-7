import "../stylesheets/HomePage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { EventItem, RandomEventItemProps } from "../components/homepage/EventItem";; 
import type { EventItemProps } from "../components/homepage/EventItem";;
import type { IEvent } from '../../../server/src/models/Events'


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type EventAndHost = IEvent & { name: string };
const HomePage = () => {
  const [events, setEvents] = useState<EventAndHost[]>()
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await axios.get<IEvent[]>(`${API_URL}/events`, { withCredentials: true });

        // Map each event to include host name
        const eventsWithHost: EventAndHost[] = await Promise.all(
          result.data.map(async (event) => {
            try {
              const userRes = await axios.get(`${API_URL}/users/${event.host._id}`, { withCredentials: true });
              console.log("userres:", userRes)
              return { ...event, name: userRes.data.user.name }; // EventAndHost
            } catch (err) {
              console.error(err);
              return { ...event, name: "Unknown" };
            }
          })
        );

        setEvents(eventsWithHost);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main id="home-page">
      <aside id="filter-events">
        <h3>Filter Events</h3>

        <div className="filter-group">
          <label>Tags:</label>
          <div><input type="checkbox" /> Music</div>
          <div><input type="checkbox" /> Business</div>
          <div><input type="checkbox" /> Community</div>
          <div><input type="checkbox" /> Outdoor</div>
        </div>

        <div className="filter-group">
          <label>Attendance:</label>
          <div><input type="checkbox" /> 0-50</div>
          <div><input type="checkbox" /> 51-100</div>
          <div><input type="checkbox" /> 100+</div>
        </div>

        <button>Apply Filters</button>
      </aside>

      <section className="container">
        {events && events.map(e => {
          const props: EventItemProps = {
            title: e.title,
            description: e.description,
            date: `${e.date}`.split('T')[0],
            time: e.time,
            location: e.location,
            posted_by: e.name,
            num_attending: e.attendees.length,
            num_interested: e.interested.length,
            num_comments: e.comments.length,
            tags: e.tags,
            posted_by_id: e.host._id
          }
          return <EventItem {...props} />
        })}
      </section>
    </main>
  );
}

export default HomePage;