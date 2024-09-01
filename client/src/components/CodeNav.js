import React , {useState,useEffect} from 'react';
import CodeCard from './CodeCard';
import { Link } from 'react-router-dom';
import './CodeNav.css';
import axios from 'axios';


function CodeNav() {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://moveo-project-backend.onrender.com/api/codes')
          .then(res => {
            setCodes(res.data);
            setLoading(false);
          })
          .catch(error => {
            setError(error);
            setLoading(false);
          });
      }, []);
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error.message}</div>;
    return (
        <div className='code-nav-container'>
            <div className='code-card-header'>
                Chose code block:
            </div>
            <div className="code-card-list">
            {codes.map((code, index) => (
                <CodeCard
                key={index} 
                title={code.name}
                code={code.currcodes}
                id = {code.id}
                />
            ))}
            <Link to="/new" className="new-code-card code-card">
                <div className="plus-icon">+</div>
                <p>Create New Code</p>
            </Link>
            </div>
        </div>
      );
}

export default CodeNav