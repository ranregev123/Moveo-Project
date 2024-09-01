import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'
import {default as db} from './dbReader.js' 
import cors from 'cors';

const port = 10000
const app = express();
app.use(express.json());
const allowedOrigins = ['https://66d47e9bb15368444937f838--relaxed-froyo-7eee23.netlify.app'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

const server = createServer(app);
const io = new Server(server);

const roomUserCounts = {}; //users per room array
const roomMentors= {}; //save mentor id per room

io.on('connection', (socket) => {
  //when a new users enters
  socket.on('joinRoom', (room) => {
    socket.join(room);
    const isMentor = (roomUserCounts[room] || 0) === 0;
    socket.emit('isMentor', isMentor);
    if(isMentor){
      roomMentors[room] = socket.id;
    }
    roomUserCounts[room] = (roomUserCounts[room] || 0) + 1;
    io.to(room).emit('userCount', roomUserCounts[room]);
  });
  //when code update => send update to other users
  socket.on('codeChange', (newCode) =>{ 
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id );
        rooms.forEach(room => {
            io.to(room).emit('codeUpdate', newCode);
        });
  });
  //on user leave 
  socket.on('disconnect', () => {
    for (const room of Object.keys(roomUserCounts)) {
      if(roomMentors[room] === socket.id){//if mentor left
        io.to(room).emit('mentorDisconnect');
      }
      roomUserCounts[room] = (roomUserCounts[room]) - 1;//update user count
      if (roomUserCounts[room] <= 0) {
          delete roomUserCounts[room];
      } else {
          io.to(room).emit('userCount', roomUserCounts[room]);  
      }
  }

  });
});


app.get("/api/codes",db.getCodes);
app.get('/api/codes/:id', db.getCodeById)
app.post('/api/codes', db.createCode);  

server.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })