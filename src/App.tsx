// Imports CSS styling
import "./App.css";
import React, { useState, useEffect } from "react";

const App = () => {

type Note = {
  id: number;
  title: string;
  content: string;
}

const [notes, setNotes] = useState<Note[]>([]);
const [title, setTitle] = useState("");
const [content, setContent] = useState("");
const [selectedNote, setSelectedNote] = useState<Note | null>(null);

useEffect(() => {
  const fetchNotes = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/notes"
      );

      const notes: Note[] =
        await response.json();

      setNotes(notes);
    } catch (e) {
      console.log(e);
    }
  };
  
  fetchNotes()
});


const handleSubmit = async (event: React.FormEvent) => {event.preventDefault();

  try {
    const response = await fetch(
      "http://localhost:5000/api/notes",
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title,
          content,
        }),
    }
  );

  const newNote = await response.json();

  setNotes([newNote, ...notes]);
  setTitle("");
  setContent("");

  } catch (e) {
    console.log(e);
  }
};

const handleNoteClick = (note: Note) => {
  setSelectedNote(note);
  setTitle(note.title);
  setContent(note.content);
};

const handleUpdateNote = async (event: React.FormEvent) => {
  event.preventDefault();

  if(!selectedNote) {
    return;
  };


  try {
    const response = await fetch(
      `http://localhost:5000/api/notes/${selectedNote.id}`,
      {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          title,
          content,
        }),
    }
  );

    const updatedNote = await response.json();

    const updatedNotesList = notes.map((note) => (
      note.id === selectedNote.id 
        ? updatedNote 
        : note)
    );

    setNotes(updatedNotesList);
    setTitle("");
    setContent("");
    setSelectedNote(null);

  } catch (e) {
    console.log(e)
  }

};

const handleCancel = () => {
  setTitle("");
  setContent("");
  setSelectedNote(null);
};

//event.stopPropogation() is important since the delete button is nested within a clickable note. It prevents the delete event from interfering with the click event on the note itself.
// The filter method is applying to the notes array where it only returns the IDs that do not match the noteId provided.  
const deleteNote = async (
  event: React.MouseEvent, 
  noteId: number
  ) => {
  event.stopPropagation();

    try {
      await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
      }
    );
    const updatedNotes = notes.filter((note) => note.id !== noteId
    );
    setNotes(updatedNotes);

    } catch (e) {
      console.log(e)
    };
};

  return (    
    /*app-containfer contains all of the UI elements for the app*/
    <div className="app-container">
        <form 
        className="note-form"
        onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleSubmit(event))}>
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
        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
        <div className="notes-grid">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="note-item" 
              onClick={() => handleNoteClick(note)}
            >
              <div className="notes-header">
                <button 
                  onClick={(event) => 
                    deleteNote(event, note.id)}
                    >
                      x
                    </button>
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