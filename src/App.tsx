// Imports CSS styling
import "./App.css";
import React, { useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
}

const App = () => {



  // Dummy notes. 
const [notes, setNotes] = useState<Note[]>([
  {
    id: 1,
    title: "test note 1",
    content: "bla bla note1",
  },

  ]);



// State variables for form inputs
const [title, setTitle] = useState("");
const [content, setContent] = useState("");


const handleSubmit = (event: React.FormEvent) => {
  event.preventDefault();


  const newNote: Note = {
    id: notes.length + 1,
    title: title, 
    content: content,
  };

  //setNotes array: spread operator passes the previos notes state into the new state in addition to the new note being added. 
  setNotes([newNote, ...notes]);
  //New state variables clear the form once a note is submitted. 
  setTitle("");
  setContent("");
};

const [selectedNote, setSelectedNote] = useState<Note | null>(null);

const handleNoteClick = (note: Note) => {
  setSelectedNote(note);
  setTitle(note.title);
  setContent(note.content);
};




  return (    
    /*app-containfer contains all of the UI elements for the app*/
    <div className="app-container">
        <form className="note-form"
              onSubmit={(event) => handleSubmit(event)}>
          <input 
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title" 
            required />
          <textarea 
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Content" 
            rows={10} 
            required />
          <button type="submit">Add Note</button>
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
        <div key={note.id} className="note-item" onClick={() => handleNoteClick(note)}>
          <div className="notes-header">
            <button>x</button>
          </div>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </div>
        ))}
      </div>
    </div>
  );
};

export default App;