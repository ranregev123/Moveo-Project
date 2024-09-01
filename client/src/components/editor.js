import React, {useState,useEffect} from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript' 
import {Controlled as ControlledEditor} from 'react-codemirror2'
import './Editor.css'
import io from 'socket.io-client';
import { useParams,useLocation,useNavigate  } from 'react-router-dom';
import axios from 'axios';

const socket = io.connect("https://moveo-project-backend.onrender.com",{ transports : ['websocket'] })

export default function Editor(props) {
    const [userCount, setUserCount] = useState(0);
    const [editorCode, setEditorCode] = useState("");
    const [titleName, setTitleName] = useState("unamed project");
    const [mentor,setMentor] = useState(false);
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    let expectedCode="";

    function handleChange(editor,data,code){
        socket.emit('codeChange', code);
        setEditorCode(code);
        //onChange(code);
        checkCodeCorrectness(code);
    }
    function checkCodeCorrectness(code) {
        setIsCodeCorrect(code === expectedCode);
    }
    //fetch data from api
    useEffect(() => {
        if (id) {
            axios.get(`https://moveo-project-backend.onrender.com/api/codes/${id}`)
                .then(res => {
                    setTitleName(res.data.name)
                    setEditorCode(res.data.currcodes); 
                    expectedCode = (res.data.expectedcodes);
                })
                .catch(error => {
                    console.error('Error fetching code:', error);
                });
        }
    }, [id]);

    //handle socket
    useEffect(() => {
        const room = location.pathname; // Use pathname as room identifier
        
        socket.emit('joinRoom', room);
    
        //  incoming user count updates
        socket.on('userCount', (count) => {
          setUserCount(count);
        });

        //code updated
        socket.on('codeUpdate', (newCode) => {
            setEditorCode(newCode);
            checkCodeCorrectness(newCode);
        });
        //redirect to home page when mentor disconnects
        socket.on('mentorDisconnect', () => {
            navigate('/');
        });

        socket.on('isMentor', (isMentor) =>{
            setMentor(isMentor)
        })

        return () => {
          socket.off('userCount');
          socket.off('codeUpdate');
        };
      }, [location.pathname]);

      //create component
    return (
    <div className="editor-container">
         {isCodeCorrect && <div className="correct-code-indicator">✔️ Code is correct! </div>}
        <div className='titles-container'>
            <div className="project-name-title">
                <div>{titleName} </div>
            </div>
            <div className="user-state-title">
                <div>Hello {mentor ?"Tom":" student"} </div>
                <div>number of active users {userCount} </div>
            </div>
        </div>
    <ControlledEditor 
    onBeforeChange={handleChange}
    value = {editorCode}
    className='code-mirror-wrapper'
    options={{
        lineNumbers: true,
        lineWrapping :true,
        lint: true,
        theme: 'material',
        mode: "javascript",
        readOnly: mentor,
    }}
    />
    </div>
  )
}

