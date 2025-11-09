import "../stylesheets/HomePage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { EventItem } from "../components/homepage/EventItem";;
import type { EventItemProps } from "../components/homepage/EventItem";
import type { IEvent } from '../../../server/src/models/Events';
import Header from "../components/homepage/Header";
import { Filter } from '../components/homepage/Filter';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type EventAndHost = IEvent & { name: string };

const HomePage = () => {
  const [events, setEvents] = useState<EventAndHost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const result = await axios.get<IEvent[]>(`${API_URL}/events`, { withCredentials: true });
        console.log(result.data[0])
        // Map each event to include host name
        const eventsWithHost: EventAndHost[] = await Promise.all(
          result.data.map(async (event) => {
            try {
              console.log("Event is:", event)
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

  const filteredEvents = events.filter((e) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;

    return (
      e.title.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term) ||
      e.location.toLowerCase().includes(term) ||
      e.name.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />
      <main id="home-page">
        <Filter />

      <section className="container">
          {filteredEvents.length === 0 ? (
            <p>No events match your search.</p>
          ) : (
            filteredEvents.map((e) => {
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
            posted_by_id: e.host._id,
            event_id: e._id
          }
          return <EventItem {...props} />
        })}
      </section>
    </main>
  );
}

export default HomePage;