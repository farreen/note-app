import React from 'react';
import MDEditor from '@uiw/react-md-editor';

function Markdown() {
  const [title, setTitle] = React.useState();
  const [content, setContent] = React.useState();
  const [list, setList] = React.useState([])

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
      setContent(text)
    })
  }

  const getListOfNote = () => {
    fetch('http://localhost:8080/api/list')
    .then(res => {
      if(res.ok){
        return res.json()
      }
    })
    .then(list => {
      console.log('list', list);
      setList(list);

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
    .then(() => {
     console.log(newValue)
    });
  }  

  return (
    <div>
      <div style ={{width: 200, backgroundColor: 'lightgray'}}>
        <ul>
          {list.map((item, index) => (
            <li key = {index}>{item.title}</li>
          ))}
        </ul>
      </div>
      <div style = {{marginLeft: 200}}>
        <input
          type = "text"
          onChange={({ target: { value } }) => setTitle(value)}
        />
      </div>
      <div style = {{marginLeft: 200}}>
        <MDEditor
          value={content}
          onChange={setContent}
        />
      </div>
      <div style = {{marginLeft: 200}}>
        <button onClick = {saveNote}>Save note</button>
      </div>
    </div>
  );
}

export default Markdown; 
