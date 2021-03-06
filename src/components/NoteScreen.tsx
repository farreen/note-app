import React from "react";
import MDEditor from "@uiw/react-md-editor";

type Note = {
  id: string;
  title: string;
  content: string;
};

type NoteReadOnlyProps = {
  note: Note;
  edit: () => void;
};

const NoteReadOnly = ({ note, edit }: NoteReadOnlyProps) => {
  return (
    <div>
      <MDEditor.Markdown source={note.id} />
      <MDEditor.Markdown
        source={note.title}
        style={{ fontSize: "24pt", fontWeight: "bold" }}
      />
      <MDEditor.Markdown source={note.content} />
      <button onClick={() => edit()}>Edit</button>
    </div>
  );
};

type NoteEditableProps = {
  discard: () => void;
  back: () => void;
  note: Note;
};

const NoteEditable = ({ discard, back, note }: NoteEditableProps) => {
  const [updatedNote, updateNote] = React.useState(note);
  const saveNote = async () => {
    await fetch("http://localhost:20959/api/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    });
    back();
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
          updateNote({ ...updatedNote, content: newContent || "" })
        }
      />
      <button onClick={saveNote}>update</button>
      <button onClick={discard}>discard</button>
    </div>
  );
};

type NoteListProps = {
  noteList: Note[];
  onSelect: (note: Note) => void;
};

const NoteList = ({ noteList, onSelect }: NoteListProps) => {
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

type AddNoteProps = {
  discard: () => void;
  display: (id: string) => void;
};

const AddNote = ({ discard, display }: AddNoteProps) => {
  const [content, setContent] = React.useState("");
  const [title, setTitle] = React.useState("");
  const addNewNote = async () => {
    const note = { title, content };
    const response = await fetch("http://localhost:20959/api/insert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    const id: string = await response.text();
    display(id);
  };
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
      />
      <MDEditor value={content} onChange={(value) => setContent(value || "")} />
      <button onClick={addNewNote}>Save</button>
      <button onClick={discard}>Discard</button>
    </div>
  );
};

type View = "read-note" | "edit-note" | "add-note" | "none";

function NoteScreen() {
  const [noteList, setnoteList] = React.useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(
    null
  );
  const [view, setView] = React.useState<View>("none");

  const getListOfNote = async () => {
    let response = await fetch("http://localhost:20959/api/list");
    let list = await response.json();
    console.log("list", list);
    setnoteList(list);
  };

  React.useEffect(() => void getListOfNote(), []);

  const selectedNote: Note | undefined = noteList.find(
    (note) => note.id === selectedNoteId
  );

  type RightPanelProps = {
    view: View;
  };

  const RightPanel = ({ view }: RightPanelProps) => {
    console.log("view: ", view);
    switch (view) {
      case "add-note":
        return (
          <AddNote
            discard={() => setView("none")}
            display={async (id: string) => {
              await getListOfNote();
              setSelectedNoteId(id);
              setView("read-note");
            }}
          />
        );
      case "read-note":
        return (
          <NoteReadOnly
            note={selectedNote!}
            edit={() => setView("edit-note")}
          />
        );
      case "edit-note":
        return (
          <NoteEditable
            note={selectedNote!}
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
      <div style={{ float: "left", width: "20%" }}>
        <button onClick={() => setView("add-note")}>Add note</button>
        <NoteList
          noteList={noteList}
          onSelect={(note) => {
            setSelectedNoteId(note.id);
            setView("read-note");
          }}
        />
      </div>

      <div style={{ float: "right", width: "80%" }}>
        <RightPanel view={view} />
      </div>
    </div>
  );
}

export default NoteScreen;
