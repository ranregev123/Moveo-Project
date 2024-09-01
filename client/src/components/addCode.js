import React, { useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import axios from 'axios';
import './addCode.css'; // You can create this CSS file for styling

export default function AddCode() {
  const [projectName, setProjectName] = useState('');
  const [templateCode, setTemplateCode] = useState('');
  const [answerCode, setAnswerCode] = useState('');

  const handleSave = () => {
    console.log('name '+ projectName+
        ' template '+ templateCode+
        ' expectedCode '+ answerCode)
    axios.post('https://moveo-project-backend.onrender.com/api/codes', {
      name: projectName,
      template: templateCode,
      expectedCode: answerCode
    })
    .then(response => {
      console.log('Code saved:', response.data);
      // Optionally, redirect or show a success message
    })
    .catch(error => {
      console.error('Error saving code:', error);
    });
  };

  return (
    <div className="add-code-container">
      <div className="input-section">
        <label htmlFor="project-name">Project Name:</label>
        <input
          type="text"
          id="project-name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
        />
      </div>
      <div className="editor-section">
        <h2>Template for Students</h2>
        <ControlledEditor
          value={templateCode}
          onBeforeChange={(editor, data, value) => setTemplateCode(value)}
          options={{
            lineNumbers: true,
            lineWrapping: true,
            theme: 'material',
            mode: 'javascript'
          }}
        />
      </div>
      <div className="editor-section">
        <h2>Answer</h2>
        <ControlledEditor
          value={answerCode}
          onBeforeChange={(editor, data, value) => setAnswerCode(value)}
          options={{
            lineNumbers: true,
            lineWrapping: true,
            theme: 'material',
            mode: 'javascript'
          }}
        />
      </div>
      <button className="save-button" onClick={handleSave}>Save</button>
    </div>
  );
}
