import { useState } from 'react'

const Filter = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>(""); // whats typed in the input

  const MAX_TAGS = 5;
  const handleAddTag = () => {
    if(tagInput.trim() === "") return;
    if(selectedTags.includes(tagInput)) return;
    setSelectedTags([...selectedTags, tagInput]);
    setTagInput("");
  };
  return (
    <aside id="filter-events">
      <h3>Filter Events</h3>

      <div className="filter-group">
        <label>Tags:
          <div style={{display: "flex"}}>
            <input type="text" style={{borderRadius: "4px 0 0 4px"}} value={tagInput} onChange={e => setTagInput(e.target.value)}/>
            <button style={{padding: 0, margin: 0, borderRadius: "0 4px 4px 0"}}
              onClick={handleAddTag}
              disabled={selectedTags.length >= MAX_TAGS}
            >+</button>
          </div>
        </label>

        {selectedTags.map(t => (
          <div
            style={{backgroundColor: "#ddd", marginBottom: "3px", borderRadius: "2px", padding: "2px 0 2px 10px", display: "flex", flexDirection: "row", alignItems: "center"}}
          >
            <span style={{flex: "1"}}>{t}</span>

            <button style={{backgroundColor: "#aaa", display: "inline", margin: 0, padding: "2px 5px", width: "auto"}}
              onClick={() => setSelectedTags( prev => (
                prev.filter(item => item !== t)
              ))}
            >x</button>
          </div>
        ))}
        {/* <div><input type="checkbox" /> Music</div>
        <div><input type="checkbox" /> Business</div>
        <div><input type="checkbox" /> Community</div>
        <div><input type="checkbox" /> Outdoor</div> */}
      </div>

      <div className="filter-group">
        <label>Attendance:</label>
        <div><input type="checkbox" /> 0-50</div>
        <div><input type="checkbox" /> 51-100</div>
        <div><input type="checkbox" /> 100+</div>
      </div>

      <button>Apply Filters</button>
    </aside>
  );
};

export { Filter };