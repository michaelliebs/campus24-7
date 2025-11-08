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
        {[1,2,3,4,5,6,7,8,9,10].map(_ => {
          const rdProps: EventItemProps = RandomEventItemProps();
          return <EventItem {...rdProps}/> 
        })}
      </section>
    </main>
  );
}

export default HomePage;