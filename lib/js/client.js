import io from 'socket.io-client';

const Client = {};
Client.socket = io.connect();

let Game;
let roomLoaded = false;
Client.left = false;
Client.right = false;
Client.up = false;
Client.down = false;

Client.setGame = (game) => {
  roomLoaded = true;
  Game = game;
};

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
    Game.movePlayer(Client.id, 0, 0);
  } else {
    let x;
    let y;

    if (Client.left && !Client.right) {
      x = -1;
    } else if (Client.right && !Client.left) {
      x = 1;
    } else {
      x = 0;
    }

    if (Client.up && !Client.down) {
      y = -1;
    } else if (Client.down && !Client.up) {
      y = 1;
    } else {
      y = 0;
    }

    Game.movePlayer(Client.id, x, y);
  }
};

Client.sendPosition = () => {
  if (Client && Client.id && roomLoaded) {
    const position = Game.getPlayerPosition(Client.id);
    if (position) {
      Client.socket.emit('sendPosition', position);
    }
  }
};

setInterval(Client.sendPosition, 100);

Client.askNewPlayer = () => {
  Client.socket.emit('newplayer');
};

Client.goToRoom = (data) => {
  roomLoaded = false;
  Client.socket.emit('goToRoom', data);
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
