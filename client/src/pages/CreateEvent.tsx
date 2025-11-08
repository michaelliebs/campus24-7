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
  }

  const MAX_TAGS = 5;
  const MAX_TAG_LEN = 25;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors: string[] = [];
    
    // Possibly disallow past scheduling
      /* date: Date; */
      /* time: string; */


    /* tags: string[]; */
    const tag_list: string[] = formData.tags.trim().replace("  ", " ").split(" ");
    const longest_tag_len: number = Math.max(...tag_list.map(t => t.length));
    if(tag_list.length > MAX_TAG_LEN) {
      errors.push("Too many tags, max of "+MAX_TAGS);
    } else if(longest_tag_len > MAX_TAG_LEN) {
      errors.push("One or more of your tags are too long, a single tag can be " + MAX_TAG_LEN + " characters long");
    }
    // Handled by 'required' + 'pattern'
      /* title: string; */
      /* description: string; */
      /* location: string; */
    
    if(errors.length > 0) {
      alert("One or more fields are not properly filled out!:\n"+errors[0]);
    } else {
      // TODO: 
      alert("Create")
    }

  }

  return (<main id="create-event">
    <h2>Create Event</h2>
    <form onSubmit={handleSubmit}>
      {/* title: string; */}
      <label> Title of event:<br/>
        <input name='title' id='title' type='text' onChange={handleChange} 
          required pattern="^(?=.*\S).{1,59}$"
        />
      </label><br/>

      {/* description: string; */}
      <label> Description of event:<br/>
        <textarea name='description' id='description' type='text' onChange={handleChange}
          required pattern="^(?=.*\S).{1,1999}$"
        />
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
        <input name='location' id='location' type='text' onChange={handleChange}
          required pattern="^(?=.*\S).{1,59}$"
        />
      </label><br/>

      {/* tags: string[]; */}
      <label> Event Tags:<br/>
        <input name='tags' id='tags' type='text' onChange={handleChange} />
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
    <button type='submit'>Create</button>
    </form>
  </main>);
};

export { CreateEvent };