import React from 'react';
import MDEditor from '@uiw/react-md-editor';

function Markdown() {
    const [value, setValue] = React.useState();
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
            setValue(text)
        })
    }
    React.useEffect(getNote ,[])
    
    const saveNote = () => {
        const newValue = {value}; 
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
      <MDEditor
        value={value}
        onChange={setValue}
      />
      <MDEditor.Markdown source={value} />
      <div>
      <button onClick = {saveNote}>Save note</button>
      </div>
    </div>
  );

}

export default Markdown; 
