import express from 'express';
import path from 'path';
import http from 'http';
import socketServer from 'socket.io';

// Webpack Requirements
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import config from '../webpack.config';

const app = express();

// Run Webpack dev server in development mode
if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true }));
}

app.use('/css', express.static(path.join(__dirname, './css')));
app.use('/js', express.static(path.join(__dirname, './js')));
app.use('/assets', express.static(path.join(__dirname, './assets')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile('index.html', { root: path.join(__dirname, '../dist') });
  } else {
    res.sendFile(path.join(__dirname, './index.html'));
  }
});

const server = http.Server(app);
const io = socketServer.listen(server);

server.lastPlayderID = 0;
server.listen(process.env.PORT || 8081, () => {
  console.log(`Listening on ${server.address().port}`);
});

function getAllPlayers(room) {
  const players = [];
  Object.keys(io.sockets.connected).forEach((socketID) => {
    const player = io.sockets.connected[socketID].player;
    if (player && player.room === room) players.push(player);
  });
  return players;
}

io.on('connection', (socket) => {
  socket.player = {
    id: server.lastPlayderID += 1,
    x: 300,
    y: 300,
    room: 'Game1',
  };
  socket.emit('getownid', socket.player.id);

  socket.on('newplayer', () => {
    socket.join(socket.player.room);
    socket.emit('allplayers', getAllPlayers(socket.player.room));
    socket.broadcast.to(socket.player.room).emit('newplayer', socket.player);
  });

  socket.on('sendPosition', (data) => {
    socket.player.x = data.x;
    socket.player.y = data.y;
    socket.broadcast.to(socket.player.room).emit('playerMoving',
      { id: socket.player.id, x: data.x, y: data.y });
  });

  socket.on('goToRoom', (data) => {
    socket.leave(socket.player.room);
    io.to(socket.player.room).emit('remove', socket.player.id);
    socket.player.room = data.room;
    socket.player.x = data.x;
    socket.player.y = data.y;
  });

  socket.on('disconnect', () => {
    io.to(socket.player.room).emit('remove', socket.player.id);
  });
});
