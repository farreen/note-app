import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button, Icon } from "@blueprintjs/core";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  date: string;
};

type NoteReadOnlyProps = {
  note: Note;
  edit: () => void;
  deleteNote: () => void;
  cancel: () => void;
};

const isString = (arg: any) => {
  return typeof arg === "string";
};

const isArrayOfString = (arg: any) => {
  if (!Array.isArray(arg)) {
    return false;
  }
  for (const item of arg) {
    if (!isString(item)) {
      return false;
    }
  }
  return true;
};

const isNote = (arg: any) => {
  return (
    isString(arg.id) &&
    isString(arg.title) &&
    isString(arg.content) &&
    isString(arg.date) &&
    isArrayOfString(arg.tags)
  );
};

const isArrayOfNotes = (arg: any) => {
  return Array.isArray(arg) && arg.filter(isNote).length === arg.length;
};

const NoteReadOnly = ({
  note,
  edit,
  deleteNote,
  cancel,
}: NoteReadOnlyProps) => {
  console.log("isNote", isNote(note));
  console.log("tag", isArrayOfString(note.tags));
  console.log("isString", isString(note.title));
  return (
    <div>
      <div
        style={{
          fontSize: "24pt",
          fontWeight: "bold",
          backgroundColor: "lightyellow",
          paddingLeft: "20px",
        }}
      >
        <span>{note.title}</span>
      </div>
      <div
        style={{
          backgroundColor: "lightyellow",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
        }}
      >
        <span style={{ fontSize: "8pt" }}>{note.tags[0]}</span>
        <div style={{ fontSize: "10pt", fontWeight: 200 }}>{note.date}</div>
        <p>{note.content}</p>
      </div>
      <div style={{ float: "right", width: "20%", marginTop: "5px" }}>
        <Icon
          style={{ margin: "10px", cursor: "pointer" }}
          icon="edit"
          onClick={() => edit()}
        />
        <Icon
          color="#f00"
          style={{ margin: "10px", cursor: "pointer" }}
          icon="trash"
          onClick={() => deleteNote()}
        />
        <Icon
          style={{ margin: "10px", cursor: "pointer" }}
          icon="undo"
          onClick={() => cancel()}
        />
      </div>
    </div>
  );
};

type NoteEditableProps = {
  discard: () => void;
  back: () => void;
  note: Note;
};

const isEqual = (left: Note, right: Note): boolean => {
  return (
    left.title === right.title &&
    left.content === right.content &&
    left.id === right.id
  );
};

const NoteEditable = ({ discard, back, note }: NoteEditableProps) => {
  const [updatedNote, updateNote] = React.useState(note);
  const [error, setError] = React.useState<string | undefined>();

  const saveNote = async () => {
    const response = await fetch("http://localhost:20959/api/notes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNote),
    });
    const responseMessage = await response.text();
    console.log("res", responseMessage);
    if (response.ok) {
      back();
    } else {
      setError(responseMessage);
    }
  };
  return (
    <div>
      <div>
        <span style={{ color: "#aa0000" }}>{error}</span>
      </div>
      <input
        type="text"
        value={updatedNote.title}
        onChange={(e) => updateNote({ ...updatedNote, title: e.target.value })}
        style={{ backgroundColor: "lightskyblue" }}
      />
      <MDEditor
        style={{ backgroundColor: "lightskyblue" }}
        value={updatedNote.content}
        height={500}
        onChange={(newContent) =>
          updateNote({ ...updatedNote, content: newContent || "" })
        }
      />
      <div style={{ margin: "5px" }}>
        {isEqual(note, updatedNote) || <div>Save changes</div>}
        <Button
          style={{ color: "#0f0", borderWidth: "0px", cursor: "pointer" }}
          disabled={isEqual(note, updatedNote)}
          onClick={saveNote}
        >
          <Icon icon="updated" color="#0f0" />
        </Button>
        <Icon
          style={{ margin: "10px", cursor: "pointer" }}
          icon="delete"
          color="#f00"
          onClick={discard}
        />
      </div>
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
  display: (responseMessage: string) => void;
};

const AddNote = ({ discard, display }: AddNoteProps) => {
  const [error, setError] = React.useState<string | undefined>();
  const [content, setContent] = React.useState("");
  const [title, setTitle] = React.useState("Add title");
  const [tag, setTag] = React.useState("Add tags");
  const addNewNote = async () => {
    const note = { title, content, tags: [tag] };
    const response = await fetch("http://localhost:20959/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    const responseMessage: string = await response.text();
    console.log("response", response);
    if (response.ok) {
      display(responseMessage);
    } else {
      setError(responseMessage);
    }
  };
  return (
    <div>
      <div>
        <span style={{ color: "#aa0000" }}>{error}</span>
      </div>
      <input
        style={{ backgroundColor: "#E5FFCC", paddingLeft: "5px" }}
        type="text"
        value={title}
        onChange={({ target: { value } }) => setTitle(value)}
      />
      <input
        style={{ backgroundColor: "#E5FFCC", paddingLeft: "5px" }}
        type="text"
        value={tag}
        onChange={({ target: { value } }) => setTag(value)}
      />
      <MDEditor
        style={{ backgroundColor: "#E5FFCC" }}
        value={content}
        onChange={(value) => setContent(value || "")}
      />
      <div style={{ marginTop: "3px", cursor: "pointer" }}>
        <Icon icon="saved" color="#0f0" onClick={addNewNote} />
        <Icon
          icon="delete"
          color="#f00"
          style={{ margin: "10px", cursor: "pointer" }}
          onClick={discard}
        />
      </div>
    </div>
  );
};

type DeleteNoteProps = {
  note: Note;
  back: () => void;
  changeView: () => void;
};
const DeleteNote = ({ note, back, changeView }: DeleteNoteProps) => {
  const deleteNote = async () => {
    const response = await fetch(
      `http://localhost:20959/api/notes/${note.id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        //body: JSON.stringify(id),
      }
    );
    console.log("Response", response);
    back();
  };
  return (
    <div style={{ float: "left", width: "80%" }}>
      <div
        style={{
          backgroundColor: "lightgray",
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingBottom: "20px",
        }}
      >
        <MDEditor.Markdown
          source={note.title}
          style={{
            fontSize: "24pt",
            fontWeight: "bold",
          }}
        />
        <MDEditor.Markdown source={note.content} />
      </div>
      <div style={{ marginTop: "5px" }}>
        <Icon
          style={{ cursor: "pointer" }}
          color="#f00"
          icon="trash"
          onClick={deleteNote}
        />
        <Icon
          style={{ margin: "20px", cursor: "pointer" }}
          icon="undo"
          onClick={changeView}
        />
      </div>
    </div>
  );
};

type View = "read-note" | "edit-note" | "add-note" | "delete-note" | "none";

function NoteScreen() {
  const [noteList, setnoteList] = React.useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(
    null
  );
  const [view, setView] = React.useState<View>("none");

  const getListOfNote = async () => {
    let response = await fetch("http://localhost:20959/api/notes");
    let list = await response.json();
    console.log("list", list);
    setnoteList(list);
    console.log("isArr", isArrayOfNotes(list));
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
            deleteNote={() => setView("delete-note")}
            cancel={() => setView("none")}
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
      case "delete-note":
        return (
          <DeleteNote
            note={selectedNote!}
            back={() => {
              getListOfNote();
              setView("none");
            }}
            changeView={() => setView("read-note")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ float: "left", width: "20%", marginTop: "20px" }}>
        <Icon
          color="#00f"
          icon="add"
          style={{ marginLeft: "25px", cursor: "pointer" }}
          onClick={() => setView("add-note")}
        />
        <NoteList
          noteList={noteList}
          onSelect={(note) => {
            setSelectedNoteId(note.id);
            setView("read-note");
          }}
        />
      </div>

      <div style={{ float: "right", width: "80%", marginTop: "25px" }}>
        <RightPanel view={view} />
      </div>
    </div>
  );
}

export default NoteScreen;
