import React from "react";
import MDEditor from "@uiw/react-md-editor";

const NoteReadOnly = ({ selectedNote, edit }) => {
  return (
    <div>
      <MDEditor.Markdown source={selectedNote.id} />
      <MDEditor.Markdown
        source={selectedNote.title}
        style={{ fontSize: "24pt", fontWeight: "bold" }}
      />
      <MDEditor.Markdown source={selectedNote.content} />
      <button onClick={() => edit()}>Edit</button>
    </div>
  );
};

const NoteEditable = ({ discard, back, note }) => {
  const [updatedNote, updateNote] = React.useState(note);
  const saveNote = () => {
    fetch("http://localhost:20959/api/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    }).then((res) => {
      console.log(res);
      back();
    });
  };
  return (
    <div>
      <input
        type="text"
        value={updatedNote.title}
        onChange={(e) => updateNote({ ...updatedNote, title: e.target.value })}
      />
      <MDEditor
        value={updatedNote.content}
        height={500}
        onChange={(newContent) =>
          updateNote({ ...updatedNote, content: newContent })
        }
      />
      <button onClick={saveNote}>update</button>
      <button onClick={discard}>discard</button>
    </div>
  );
};

const NoteList = ({ noteList, onSelect }) => {
  return (
    <div>
      <ul>
        {noteList.map((note) => (
          <li key={note.id}>
            <a href="javascript:void 0" onClick={() => onSelect(note)}>
              {note.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AddNote = ({ discard }) => {
  const [content, setContent] = React.useState("");
  const [title, setTitle] = React.useState("");
  const addNewNote = () => {
    const note = { title, content };
    fetch("http://localhost:20959/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    }).then((res) => {
      console.log(res);
    });
  };
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
      />
      <MDEditor value={content} onChange={setContent} />
      <button onClick={addNewNote}>Save</button>
      <button onClick={discard}>Discard</button>
    </div>
  );
};

function NoteScreen() {
  const [noteList, setnoteList] = React.useState([]);
  const [selectedNoteId, setSelectedNoteId] = React.useState(null);
  const [view, setView] = React.useState(undefined);
  const getListOfNote = () => {
    fetch("http://localhost:20959/api/list")
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((list) => {
        console.log("list", list);
        setnoteList(list);
      });
  };
  React.useEffect(getListOfNote, []);

  const leftPanelStyle = { float: "left", width: "20%" };
  const rightPanelStyle = { float: "left", width: "80%" };

  const selectedNote = noteList.find((note) => note.id === selectedNoteId);
  console.log("selectedNote: ", selectedNote, noteList, selectedNoteId);
  const RightPanel = ({ view }) => {
    console.log("view: ", view);
    switch (view) {
      case "add-note":
        return <AddNote discard={() => setView(undefined)} />;
      case "read-note":
        return (
          <NoteReadOnly
            selectedNote={selectedNote}
            edit={() => setView("edit-note")}
          />
        );
      case "edit-note":
        return (
          <NoteEditable
            note={selectedNote}
            back={() => {
              getListOfNote();
              setView("read-note");
            }}
            discard={() => setView("read-note")}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <div style={leftPanelStyle}>
        <button onClick={() => setView("add-note")}>Add note</button>
        <NoteList
          noteList={noteList}
          onSelect={(note) => {
            setSelectedNoteId(note.id);
            setView("read-note");
          }}
        />
      </div>

      <div style={rightPanelStyle}>
        <RightPanel view={view} />
      </div>
    </div>
  );
}

export default NoteScreen;
