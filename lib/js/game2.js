/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

import game from './main';
import Client from './client';

import 'pixi';
import 'p2';
import Phaser from 'phaser';

const Game = {};

Game.init = () => {
  game.stage.disableVisibilityChange = true;

};

Game.preload = () => {
  game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
  game.load.image('sprite', 'assets/sprites/sprite.png');
};

Game.create = () => {
  game.time.advancedTiming = true;
  Game.playerMap = {};
  const testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
  testKey.onDown.add(Client.sendTest, this);

  const leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  leftKey.onDown.add(Client.sendLeftDown, this);
  leftKey.onUp.add(Client.sendLeftUp, this);

  const rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  rightKey.onDown.add(Client.sendRightDown, this);
  rightKey.onUp.add(Client.sendRightUp, this);

  const upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
  upKey.onDown.add(Client.sendUpDown, this);
  upKey.onUp.add(Client.sendUpUp, this);

  const downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
  downKey.onDown.add(Client.sendDownDown, this);
  downKey.onUp.add(Client.sendDownUp, this);

  const map = game.add.tilemap('map');
  map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
  let layer;
  for (let i = 0; i < map.layers.length; i++) {
    layer = map.createLayer(i);
  }
  Client.setGame(Game);
  Client.askNewPlayer();
};

Game.render = () => {
  game.debug.text(game.time.fps, 2, 14, '#00ff00');
};

Game.addNewPlayer = (id, x, y) => {
  Game.playerMap[id] = game.add.sprite(x, y, 'sprite');
  Game.playerMap[id].checkWorldBounds = true;
  Game.playerMap[id].events.onOutOfBounds.add(Game.playerOutOfBounds, this);
  game.physics.enable(Game.playerMap[id]);
};

Game.playerOutOfBounds = (player) => {
  if (player.x < 0) {
    console.log("Leaving left");
  } else if (player.x > 24 * 32) {
    console.log("Leaving right");
  } else if (player.y < 0) {
    console.log("Leaving up");
  } else if (player.y > 17 * 32) {
    console.log("Leaving down");
  }
};

Game.getPlayerPosition = (id) => {
  const player = Game.playerMap[id];
  if (player) {
    return { x: player.x, y: player.y };
  } else {
    return null;
  }
};

Game.movePlayer = (id, x, y) => {
  const player = Game.playerMap[id];
  if (player) {
    player.body.velocity.x = x * 200;
    player.body.velocity.y = y * 200;
  }
};

Game.moveOtherPlayer = (id, x, y) => {
  const player = Game.playerMap[id];
  game.physics.arcade.moveToXY(player, x, y, 0, 90);
};

Game.removePlayer = (id) => {
  Game.playerMap[id].destroy();
  delete Game.playerMap[id];
};

export default Game;
