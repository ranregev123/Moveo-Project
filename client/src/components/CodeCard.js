import React from 'react';
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { useNavigate } from 'react-router-dom';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import './CodeCard.css'; 

function CodeCard({ title,  code= "",id }) {
  const navigate = useNavigate();
  const preview = code.length > 100 ? code.substring(0, 100) + '...' : code;
  const handleClick = () => {
    navigate(`/editor/${id}`); // Navigate to the URL with the ID
  };

  return (
    <div className="code-card" onClick={handleClick}>
      <h3 className="code-card-title">{title}</h3>
      <ControlledEditor 
    value = {preview}
    className='code-preview'
    options={{
        lineNumbers: true,
        lint: true,
        theme: 'material',
        mode: 'javascript',
        readOnly: true,
    }}/>
    </div>
  );
}

export default CodeCard;
