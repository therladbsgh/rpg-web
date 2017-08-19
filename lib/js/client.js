/**
 * Created by Jerome on 03-03-17.
 */

import io from 'socket.io-client';
import Game from './game';

const Client = {};
Client.socket = io.connect();

Client.id = '';
Client.left = false;
Client.right = false;
Client.up = false;
Client.down = false;
Client.pastPressed = 'none';

Client.sendLeftDown = () => {
  Client.left = true;
  Client.pastPressed = 'left';
  Client.handleMovement();
};

Client.sendLeftUp = () => {
  Client.left = false;
  Client.pastPressed = 'none';
  Client.handleMovement();
};

Client.sendRightDown = () => {
  Client.right = true;
  Client.pastPressed = 'right';
  Client.handleMovement();
};

Client.sendRightUp = () => {
  Client.right = false;
  Client.pastPressed = 'none';
  Client.handleMovement();
};

Client.sendUpDown = () => {
  Client.up = true;
  Client.pastPressed = 'up';
  Client.handleMovement();
};

Client.sendUpUp = () => {
  Client.up = false;
  Client.pastPressed = 'none';
  Client.handleMovement();
};

Client.sendDownDown = () => {
  Client.down = true;
  Client.pastPressed = 'down';
  Client.handleMovement();
};

Client.sendDownUp = () => {
  Client.down = false;
  Client.pastPressed = 'none';
  Client.handleMovement();
};

Client.handleMovement = () => {
  if (!Client.left && !Client.right && !Client.up && !Client.down) {
    Game.movePlayer(Client.id, 0, 0);
  } else if (Client.left && Client.right) {
    Game.movePlayer(Client.id, 0, 0);
  } else if (Client.up && Client.down) {
    Game.movePlayer(Client.id, 0, 0);
  } else if (Client.pastPressed === 'left') {
    Game.movePlayer(Client.id, -1, 0);
  } else if (Client.pastPressed === 'right') {
    Game.movePlayer(Client.id, 1, 0);
  } else if (Client.pastPressed === 'up') {
    Game.movePlayer(Client.id, 0, -1);
  } else if (Client.pastPressed === 'down') {
    Game.movePlayer(Client.id, 0, 1);
  } else if (Client.left && !Client.right && !Client.up && !Client.down) {
    Game.movePlayer(Client.id, -1, 0);
  } else if (Client.right && !Client.left && !Client.up && !Client.down) {
    Game.movePlayer(Client.id, 1, 0);
  } else if (Client.up && !Client.down && !Client.left && !Client.right) {
    Game.movePlayer(Client.id, 0, -1);
  } else if (Client.down && !Client.up && !Client.left && !Client.right) {
    Game.movePlayer(Client.id, 0, 1);
  }
};

Client.sendPosition = () => {
  if (Client.id) {
    const position = Game.getPlayerPosition(Client.id);
    Client.socket.emit('sendPosition', position);
  }
};

setInterval(Client.sendPosition, 100);

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

Client.socket.on('getownid', (id) => {
  Client.id = id;
});

Client.socket.on('allplayers', (data) => {
  for (let i = 0; i < data.length; i++) {
    Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
  }

  Client.socket.on('playerMoving', (data) => {
    Game.moveOtherPlayer(data.id, data.x, data.y);
  });

  Client.socket.on('remove', (id) => {
    Game.removePlayer(id);
  });
});

export default Client;
