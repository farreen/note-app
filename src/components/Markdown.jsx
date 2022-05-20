import React from 'react';
import MDEditor from '@uiw/react-md-editor';

function Markdown() {
  const [title, setTitle] = React.useState();
  const [content, setContent] = React.useState();
  const [noteList, setnoteList] = React.useState([]);
  const [selectedTitle, setSelectedTitle] = React.useState(null);
  const [displayContent, setDisplayContent] = React.useState(null);  
  const [id, setId] = React.useState();
  const [selectedNote, setSelectedNote] = React.useState(null);  
  const [editing, setEditing] = React.useState(false);  

  const getNote = () => {
    fetch('http://localhost:8080/api/get')
    .then((res) => {
      if(res.ok) {
        console.log(res);
        return res.text();
      }
    })
    .then(text => {
      console.log(text);
      setContent(text);
    })
  }

  const getListOfNote = () => {
    fetch('http://localhost:8080/api/list')
    .then(res => {
      if(res.ok){
        return res.json();
      }
    })
    .then(list => {
      console.log('list', list);  
      setnoteList(list);
    })
  }
  React.useEffect(getNote, [])
  React.useEffect(getListOfNote, [])
    
  const saveNote = () => {
    const newValue = {title, content}; 
    fetch('http://localhost:8080/api/insert',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newValue)    
    })
    .then(res => {
      console.log(res);
    })
  }

  const updateNote = () => {
    const note = selectedNote;
    fetch('http://localhost:8080/api/update',{
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(note)
    })
    .then(res => {
      console.log(res);  
    })
  }

  return (
    <div>
      <div style={{width: 200, backgroundColor: 'lightgray'}}>
        <ul>
          {noteList.map((note, index) => (
            <li>    
              <a href="javascript:void 0" onClick={() => setSelectedNote(note)}>{note.title}</a>
            </li>  
          ))}
        </ul>
      </div>

      {selectedNote !== null ? editing === false ? <div> 
        <MDEditor.Markdown source={selectedNote.id} />
        <MDEditor.Markdown source={selectedNote.title} style={{fontSize: "24pt", fontWeight: "bold"}} />
        <MDEditor.Markdown source={selectedNote.content} />
        <button onClick={() => setEditing(true)}>Edit</button>
        </div> :<div>
          <input type="text" 
            value={selectedNote.title} 
            onChange={(e) => setSelectedNote({...selectedNote, title: e.target.value})}
          />
          <MDEditor 
            value={selectedNote.content}
            onChange={(newContent) => setSelectedNote({...selectedNote, content: newContent})}
          />
          <button onClick={updateNote}>update</button>
        </div>
      : null} 

      <div style={{marginLeft: 200}}>
        <input
          type = "text"
          onChange={({target: {value}}) => setTitle(value)}
        />
      </div>
      <div style={{marginLeft: 200}}>
        <MDEditor
          value={content}
          onChange={setContent}
        />
      </div>
      <div style={{marginLeft: 200}}>
        <button onClick={saveNote}>Save note</button>
      </div>
    </div>
  );
}

export default Markdown; 
