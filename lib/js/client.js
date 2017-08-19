/**
 * Created by Jerome on 03-03-17.
 */

import io from 'socket.io-client';
import Game from './game';

const Client = {};
Client.socket = io.connect();

Client.left = false;
Client.right = false;
Client.up = false;
Client.down = false;

Client.sendLeftDown = () => {
  Client.left = true;
  Client.handleMovement();
};

Client.sendLeftUp = () => {
  Client.left = false;
  Client.handleMovement();
};

Client.sendRightDown = () => {
  Client.right = true;
  Client.handleMovement();
};

Client.sendRightUp = () => {
  Client.right = false;
  Client.handleMovement();
};

Client.sendUpDown = () => {
  Client.up = true;
  Client.handleMovement();
};

Client.sendUpUp = () => {
  Client.up = false;
  Client.handleMovement();
};

Client.sendDownDown = () => {
  Client.down = true;
  Client.handleMovement();
};

Client.sendDownUp = () => {
  Client.down = false;
  Client.handleMovement();
};

Client.handleMovement = () => {
  if (!Client.left && !Client.right && !Client.up && !Client.down) {
    Client.socket.emit('movePlayer', { x: 0, y: 0 });
  } else if (Client.left && Client.right) {
    Client.socket.emit('movePlayer', { x: 0, y: 0 });
  } else if (Client.up && Client.down) {
    Client.socket.emit('movePlayer', { x: 0, y: 0 });
  } else if (Client.left) {
    Client.socket.emit('movePlayer', { x: -1, y: 0 });
  } else if (Client.right) {
    Client.socket.emit('movePlayer', { x: 1, y: 0 });
  } else if (Client.up) {
    Client.socket.emit('movePlayer', { x: 0, y: -1 });
  } else if (Client.down) {
    Client.socket.emit('movePlayer', { x: 0, y: 1 });
  }
};

Client.sendTest = () => {
  console.log('test sent');
  Client.socket.emit('test');
};

Client.askNewPlayer = () => {
  Client.socket.emit('newplayer');
};

Client.socket.on('newplayer', (data) => {
  Game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('allplayers', (data) => {
  for (let i = 0; i < data.length; i++) {
    Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }

  Client.socket.on('playerMoving', (data) => {
    Game.movePlayer(data.id, data.x, data.y);
  });

  Client.socket.on('remove', (id) => {
    Game.removePlayer(id);
  });
});

export default Client;
