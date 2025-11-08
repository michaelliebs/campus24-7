import "../stylesheets/HomePage.css"
import { EventItem, RandomEventItemProps } from "../components/homepage/EventItem";; 
import type { EventItemProps } from "../components/homepage/EventItem";;

const HomePage = () => {
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
        <div className="event">
          <h2>Summer Music Festival</h2>
          <p className="meta">Posted by <strong>Alex Johnson</strong></p>
          <p>Join us for an outdoor festival full of live bands, food trucks, and fun activities for all ages!</p>
          <div className="stats">
            <span>🎟️ 120 going</span> |
            <span>👀 230 interested</span> |
            <span>💬 18 comments</span>
          </div>
          <div className="tags">
            <span className="tag">Music</span>
            <span className="tag">Outdoor</span>
            <span className="tag">Festival</span>
          </div>
        </div>

        
        <div className="event">
          <h2>Startup Networking Night</h2>
          <p className="meta">Posted by <strong>Maria Lee</strong></p>
          <p>An evening to meet fellow entrepreneurs, pitch ideas, and find potential collaborators.</p>
          <div className="stats">
            <span>🎟️ 45 going</span> | 
            <span>👀 70 interested</span> | 
            <span>💬 5 comments</span>
          </div>
          <div className="tags">
            <span className="tag">Business</span>
            <span className="tag">Networking</span>
            <span className="tag">Startups</span>
          </div>
        </div>

        <div className="event">
          <h2>Community Clean-Up Day</h2>
          <p className="meta">Posted by <strong>Jamie Rivera</strong></p>
          <p>Help make our neighborhood shine! Bring gloves and a smile. All ages welcome.</p>
          <div className="stats">
            <span>🎟️ 80 going</span> | 
            <span>👀 95 interested</span> | 
            <span>💬 9 comments</span>
          </div>
          <div className="tags">
            <span className="tag">Community</span>
            <span className="tag">Environment</span>
            <span className="tag">Volunteering</span>
          </div>
        </div>

        {[1,2,3,4,5,6,7,8,9,10].map(_ => {
          const rdProps: EventItemProps = RandomEventItemProps();
          return <EventItem {...rdProps}/> 
        })}
      </section>
    </main>
  );
}

export default HomePage;