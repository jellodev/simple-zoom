import http from 'http';
import { Server } from 'socket.io';
import express from 'express';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/public/views');
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req, res) => res.render('home'));
app.get('/*', (req, res) => res.redirect('/'));

const port = 3000;
const handleListen = () => console.log(`Listening on port ${port}`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on('connection', (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on('enterRoom', (roomInfo, done) => {
    const {
      room: { name },
      user: { nickname },
    } = roomInfo;
    console.log(name, nickname);
    socket.join(name);
    done();
    socket['nickname'] = nickname;
    socket.to(name).emit('welcome', nickname);
  });

  socket.on('newMessage', (message, roomName, done) => {
    socket.to(roomName).emit('newMessage', message, socket['nickname']);
    done();
  });

  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit('bye', socket['nickname']);
    });
  });
});

httpServer.listen(port, handleListen);
