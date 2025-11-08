type EventItemProps = {
  title: string,
  posted_by: string,
  description: string,
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
    posted_by: words[Math.floor(Math.random() * words.length)],    
    description: "Ipsam non nesciunt cum dolore id. Ut id cum ab quidem ad et eius illum. Nemo eligendi qui modi ut magnam commodi.Fuga molestiae nemo aut. Quia molestiae laudantium esse magni voluptatum odit. Omnis blanditiis suscipit repellendus qui aut sit quas voluptatem. Sequi maiores sed ut quaerat consequatur.",
    num_attending: Math.floor(Math.random() * 600),
    num_interested: Math.floor(Math.random() * 600),
    num_comments: Math.floor(Math.random() * 20),
    tags: ["Music", "Beach", "Holiday"]
  }
}

const EventItem = ({
  title,
  posted_by,
  description,
  num_attending,
  num_interested,
  num_comments,
  tags
}: EventItemProps) => {
  console.log(title)
  return (<div className="event">
    <h2>{title}</h2>
    <p className="meta">Posted by <strong>{posted_by}</strong></p>
    <p>{description}</p>
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