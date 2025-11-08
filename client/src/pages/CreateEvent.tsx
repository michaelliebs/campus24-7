import { useState } from 'react';
import '../stylesheets/CreateEvent.css';

type CreateEventFormData = {
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  tags: string
};

const CreateEvent = () => {
  const [formData, setFormData] = useState<CreateEventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    tags: ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    console.log(formData)
  }

  return (<main id="create-event">
    <h2>Create Event</h2>
    <form>
      {/* title: string; */}
      <label> Title of event:<br/>
        <input name='title' id='title' type='text' onChange={handleChange}/>
      </label><br/>

      {/* description: string; */}
      <label> Description of event:<br/>
        <textarea name='description' id='description' type='text' onChange={handleChange}/>
      </label><br/>

      {/* date: Date; */}
      <label> Date of event:<br/>
        <input name='date' id='date' type='date' onChange={handleChange}/>
      </label><br/>

      {/* time: string; */}
      <label> Time of event:<br/>
        <input name='time' id='time' type='time' onChange={handleChange}/>
      </label><br/>

      {/* location: string; */}
      <label> Location of event:<br/>
        <input name='location' id='location' type='text' onChange={handleChange}/>
      </label><br/>

      {/* tags: string[]; */}
      <label> Event Tags:<br/>
        <input name='tags' id='tags' type='text' onChange={handleChange}/>
      </label><br/>

      {/* N/A for input */}
        {/* host: Types.ObjectId; // reference to the user hosting the event */}
        {/* attendees: Types.ObjectId[]; // list of users attending */}
        {/* interested: Types.ObjectId[]; // list of users interested */}
        {/* comments: Types.ObjectId[]; // list of comments on the event */}
        {/* email: string; */}
        {/* phone: string; */}
        {/* status: string; */}
        {/* createdAt: Date; */}
        {/* updatedAt: Date; */}
    </form>
  </main>);
};

export { CreateEvent };