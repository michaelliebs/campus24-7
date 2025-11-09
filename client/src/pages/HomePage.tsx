import "../stylesheets/HomePage.css"
import { useEffect, useState } from "react";
import axios from "axios";
import { EventItem } from "../components/homepage/EventItem";
import type { EventItemProps } from "../components/homepage/EventItem";
import type { IEvent } from '../../../server/src/models/Events';
import Header from "../components/homepage/Header";
import { Filter } from '../components/homepage/Filter';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type EventAndHost = IEvent & { name: string };

const HomePage = () => {
  const [events, setEvents] = useState<EventAndHost[]>([]);
  const [loading, setLoading] = useState(true); // NEW
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const result = await axios.get<IEvent[]>(`${API_URL}/events`, { withCredentials: true });

        const eventsWithHost: EventAndHost[] = await Promise.all(
          result.data.map(async (event) => {
            try {
              const userRes = await axios.get(`${API_URL}/users/${event.host._id}`, { withCredentials: true });
              return { ...event, name: userRes.data.user.name };
            } catch (err) {
              console.error(err);
              return { ...event, name: "Unknown" };
            }
          })
        );

        setEvents(eventsWithHost);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((e) => {
    const term = searchTerm.trim().toLowerCase();
    const normalizedSelectedTags = selectedTags.map((t) => t.toLowerCase());

    const matchesText =
      !term ||
      e.title.toLowerCase().includes(term) ||
      e.description.toLowerCase().includes(term) ||
      e.location.toLowerCase().includes(term) ||
      e.name.toLowerCase().includes(term);

    const matchesTags =
      normalizedSelectedTags.length === 0
        ? true
        : Array.isArray(e.tags) &&
          normalizedSelectedTags.every((selectedTag) =>
            e.tags!.some((eventTag) => eventTag.toLowerCase() === selectedTag)
          );

    return matchesText && matchesTags;
  });

  return (
    <>
      <Header
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
      />

      <main id="home-page">
        <Filter
          selectedTags={selectedTags}
          onAddTag={(tag) =>
            setSelectedTags((prev) =>
              prev.includes(tag) ? prev : [...prev, tag]
            )
          }
          onRemoveTag={(tag) =>
            setSelectedTags((prev) => prev.filter((t) => t !== tag))
          }
        />

        {loading ? (
          <div className="loading-container" aria-live="polite">
            <div className="spinner" style={{ width: 40, height: 40, margin: "1rem auto" }}>
              <svg viewBox="0 0 50 50" style={{ width: "100%", height: "100%" }}>
                <circle cx="25" cy="25" r="20" fill="none" stroke="#ccc" strokeWidth="4" />
                <path d="M45 25a20 20 0 00-7-15" fill="none" stroke="#333" strokeWidth="4" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <p style={{ margin: "2rem", textAlign: "center" }}>No events match your search.</p>
        ) : (
          <section className="container">
            {filteredEvents.map((e) => {
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
              };
              return <EventItem key={e._id} {...props} />;
            })}
          </section>
        )}
      </main>
    </>
  );
};

export default HomePage;
