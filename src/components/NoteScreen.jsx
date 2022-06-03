import React from "react";
import MDEditor from "@uiw/react-md-editor";

const NoteReadOnly = ({ selectedNote, setEditing }) => {
  return (
    <div>
      <MDEditor.Markdown source={selectedNote.id} />
      <MDEditor.Markdown
        source={selectedNote.title}
        style={{ fontSize: "24pt", fontWeight: "bold" }}
      />
      <MDEditor.Markdown source={selectedNote.content} />
      <button onClick={() => setEditing(true)}>Edit</button>
      <button>add note</button>
    </div>
  );
};

const NoteEditable = ({ selectedNote, setSelectedNote, updateNote }) => {
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
        onChange={(newContent) =>
          setSelectedNote({ ...selectedNote, content: newContent })
        }
      />
      <button onClick={updateNote}>update</button>
    </div>
  );
};

const NoteList = ({ noteList, setSelectedNote, style }) => {
  return (
    <div style={style}>
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

function NoteScreen() {
  const [noteList, setnoteList] = React.useState([]);
  const [selectedTitle, setSelectedTitle] = React.useState(null);
  const [selectedNote, setSelectedNote] = React.useState(null);
  const [editing, setEditing] = React.useState(false);

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

  const leftPanelStyle = { float: "left", width: "20%" };
  const rightPanelStyle = { float: "left", width: "80%" };
  return (
    <div>
      <NoteList
        style={leftPanelStyle}
        noteList={noteList}
        setSelectedNote={setSelectedNote}
      />

      <div style={rightPanelStyle}>
        {selectedNote !== null ? (
          editing === false ? (
            <NoteReadOnly selectedNote={selectedNote} setEditing={setEditing} />
          ) : (
            <NoteEditable
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
              updateNote={updateNote}
            />
          )
        ) : null}
      </div>
    </div>
  );
}

export default NoteScreen;
