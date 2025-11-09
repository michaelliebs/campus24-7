type EventItemProps = {
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  posted_by: string,
  num_attending: number,
  num_interested: number,
  num_comments: number
  tags: string[]
}

const RandomEventItemProps = () => {
  const words: string[] = [
    "car", "community", "clean", "of", "the", "nation", "stony brook", "student", "event", "quick"
  ];

  let title: string = ""
  for(let i = 0; i < 3; i++) {
    title += words[Math.floor(Math.random() * words.length)];
    title += " ";
  }
  return {
    title,
    description: "Ipsam non nesciunt cum dolore id. Ut id cum ab quidem ad et eius illum. Nemo eligendi qui modi ut magnam commodi.Fuga molestiae nemo aut. Quia molestiae laudantium esse magni voluptatum odit. Omnis blanditiis suscipit repellendus qui aut sit quas voluptatem. Sequi maiores sed ut quaerat consequatur.",
    date: "1/11/11",
    time: "3:00pm",
    location: "Melville Library",
    posted_by: words[Math.floor(Math.random() * words.length)],    
    num_attending: Math.floor(Math.random() * 600),
    num_interested: Math.floor(Math.random() * 600),
    num_comments: Math.floor(Math.random() * 20),
    tags: ["Music", "Beach", "Holiday"]
  }
}


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
  tags
}: EventItemProps) => {
  return (<div className="event">
    <div className="title-author" style={{display: "flex"}}>
      <h2 style={{display: "inline", margin: 0}}>{title}</h2>
      <span style={{flex: 1}}> </span>
      <span className="meta">Posted by <strong>{posted_by}</strong></span>
    </div>
    
    <div className="time-date-location-row">
      <span>{time}, </span>
      <span>{date} </span>
      •
      <span> {location}</span>
    </div>
    {/* <p className="meta">Posted by <strong>{posted_by}</strong></p> */}
    <p style={{margin: "10px 0"}}>{description}</p>
    <div className="stats">
      <span>🎟️ {num_attending} going</span> |
      <span>👀 {num_interested} interested</span> |
      <span>💬 {num_comments} comments</span>
    </div>
    <div className="tags">
      {tags.map(t => {
        return <span className="tag">{t}</span>
      })}
    </div>
  </div>);
};

export { EventItem, RandomEventItemProps };
export type { EventItemProps };