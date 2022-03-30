import React from 'react';
import MDEditor from '@uiw/react-md-editor';

function Markdown() {
    const [title, setTitle] = React.useState();
    const [content, setContent] = React.useState();

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
    React.useEffect(getNote ,[])
    
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
      <input
        type = "text"
        onChange={({ target: { value } }) => setTitle(value)}
      />
      <MDEditor
        value={content}
        onChange={setContent}
      />
      <div>
      <button onClick = {saveNote}>Save note</button>
      </div>
    </div>
  );

}

export default Markdown; 
