import { Link } from "react-router-dom";

type EventItemProps = {
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  posted_by: string,
  num_attending: number,
  num_interested: number,
  num_comments: number,
  tags: string[],
  posted_by_id: string,
  event_id?: string
};

const EventItem = ({
  title,
  description,
  date,
  time,
  location,
  posted_by,
  num_attending,
  num_interested,
  num_comments,
  tags,
  posted_by_id,
  event_id
}: EventItemProps) => {
  return (
    <Link
      to={`/events/${event_id}`}
      className="event-link"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="event" style={{
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "transform 0.2s, box-shadow 0.2s"
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: "1.35rem",
          fontWeight: 600,
          margin: "0 0 6px 0",
          lineHeight: "1.3em",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}>{title}</h2>

        {/* Posted by */}
        <div style={{
          fontSize: "0.9rem",
          color: "#555",
          marginBottom: "6px"
        }}>
          Posted by{" "}
          <Link
            to={`/profile/${posted_by_id}`}
            className="user-link"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "#3498db" }}
          >
            {posted_by}
          </Link>
        </div>

        {/* Time & Location */}
        <div style={{
          fontSize: "0.9rem",
          color: "#666",
          display: "flex",
          flexWrap: "wrap",
          gap: "5px"
        }}>
          <span>{time},</span>
          <span>{date}</span>
          <span>• {location}</span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: "0.95rem",
          color: "#333",
          lineHeight: "1.4em",
          maxHeight: "4.2em",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {description}
        </p>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: "15px",
          fontSize: "0.85rem",
          color: "#555"
        }}>
          <span>🎟️ {num_attending} going</span>
          <span>👀 {num_interested} interested</span>
          <span>💬 {num_comments} comments</span>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {tags.map((t, i) => (
            <span key={i} style={{
              fontSize: "0.75rem",
              backgroundColor: "#3498db",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "6px",
              textTransform: "capitalize"
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export { EventItem };
export type { EventItemProps };
