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

const NoteEditable = ({ selectedNote, setSelectedNote, updateNote, discard }) => {
  return (
    <div>
      <input
        type="text"
        value={selectedNote.title}
        onChange={(e) =>
          setSelectedNote({ ...selectedNote, title: e.target.value })
        }
      />
      <MDEditor
        value={selectedNote.content}
        height={500}
        onChange={(newContent) =>
          setSelectedNote({ ...selectedNote, content: newContent })
        }
      />
      <button onClick={updateNote}>update</button>
      <button onClick={discard}>discard</button>
    </div>
  );
};

const NoteList = ({ noteList, setSelectedNote }) => {
  return (
    <div>
      <ul>
        {noteList.map((note) => (
          <li key={note.id}>
            <a href="javascript:void 0" onClick={() => setSelectedNote(note)}>
              {note.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AddNote = ({
  content,
  setContent,
  title,
  setTitle,
  addNewNote,
  discard,
}) => {
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
  const [selectedNote, setSelectedNote] = React.useState(null);
  const [title, setTitle] = React.useState();
  const [content, setContent] = React.useState();
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

  const updateNote = () => {
    const note = selectedNote;
    fetch("http://localhost:20959/api/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    }).then((res) => {
      console.log(res);
    });
  };

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

  const leftPanelStyle = { float: "left", width: "20%" };
  const rightPanelStyle = { float: "left", width: "80%" };

  const RightPanel = ({ view }) => {
    console.log("view: ", view);
    switch (view) {
      case "add-note":
        return (
          <AddNote
            content={content}
            setContent={setContent}
            title={title}
            setTitle={setTitle}
            addNewNote={addNewNote}
            discard={() => setView(undefined)}
          />
        );
      case "read-note":
        return (
            <NoteReadOnly selectedNote={selectedNote} edit={() => setView("edit-note")} />
        );
      case "edit-note":
        return (
          <NoteEditable
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            updateNote={updateNote}
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
          setSelectedNote={(note) => {
            setSelectedNote(note);
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
