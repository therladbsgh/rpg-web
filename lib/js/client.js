import io from 'socket.io-client';

const Client = {};
Client.socket = io.connect();

let Game;
let roomLoaded = false;

Client.keyBinding = {
  left: {
    down: () => { Game.getPlayer(Client.id).sendLeftDown(); },
    up: () => { Game.getPlayer(Client.id).sendLeftUp(); },
  },
  right: {
    down: () => { Game.getPlayer(Client.id).sendRightDown(); },
    up: () => { Game.getPlayer(Client.id).sendRightUp(); },
  },
  up: {
    down: () => { Game.getPlayer(Client.id).sendUpDown(); },
    up: () => { Game.getPlayer(Client.id).sendUpUp(); },
  },
  down: {
    down: () => { Game.getPlayer(Client.id).sendDownDown(); },
    up: () => { Game.getPlayer(Client.id).sendDownUp(); },
  },
};

Client.getId = () => {
  return Client.id;
};

Client.setGame = (game) => {
  Game = game;
  roomLoaded = true;
};

Client.sendPosition = () => {
  if (Client && Client.id && roomLoaded) {
    const player = Game.getPlayer(Client.id);
    if (player) {
      const position = player.getPosition();
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
    Game.getPlayer(data.id).moveFromServer(data.x, data.y);
  });

  Client.socket.on('remove', (id) => {
    Game.removePlayer(id);
  });
});

export default Client;
