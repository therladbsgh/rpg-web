import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Player from '../objects/Player';

class Room {
  constructor(game, client) {
    this.game = game;
    this.client = client;
    this.playerMap = {};
  }

  init() {
    this.game.stage.disableVisibilityChange = true;
  }

  preload() {
    this.game.load.image('sprite', 'assets/sprites/sprite.png');
  }

  create() {
    this.game.time.advancedTiming = true;

    const leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(this.client.keyBinding.left.down, this);
    leftKey.onUp.add(this.client.keyBinding.left.up, this);

    const rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(this.client.keyBinding.right.down, this);
    rightKey.onUp.add(this.client.keyBinding.right.up, this);

    const upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.client.keyBinding.up.down, this);
    upKey.onUp.add(this.client.keyBinding.up.up, this);

    const downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.client.keyBinding.down.down, this);
    downKey.onUp.add(this.client.keyBinding.down.up, this);

    const map = this.game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    for (let i = 0; i < map.layers.length; i++) {
      map.createLayer(i);
    }
    this.client.setGame(this);
    this.client.askNewPlayer();
  }

  render() {
    this.game.debug.text(this.game.time.fps, 2, 14, '#00ff00');
  }

  addNewPlayer(id, x, y) {
    this.playerMap[id] = new Player(id, x, y, this.game);
  }

  getPlayer(id) {
    return this.playerMap[id];
  }

  removePlayer(id) {
    const player = this.playerMap[id];
    if (player) {
      player.sprite.destroy();
      delete this.playerMap[id];
    }
  }
}

export default Room;
