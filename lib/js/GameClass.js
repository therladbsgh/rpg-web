import 'pixi';
import 'p2';
import Phaser from 'phaser';

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
    leftKey.onDown.add(this.client.sendLeftDown, this);
    leftKey.onUp.add(this.client.sendLeftUp, this);

    const rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(this.client.sendRightDown, this);
    rightKey.onUp.add(this.client.sendRightUp, this);

    const upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    upKey.onDown.add(this.client.sendUpDown, this);
    upKey.onUp.add(this.client.sendUpUp, this);

    const downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    downKey.onDown.add(this.client.sendDownDown, this);
    downKey.onUp.add(this.client.sendDownUp, this);

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
    this.playerMap[id] = this.game.add.sprite(x, y, 'sprite');
    this.playerMap[id].checkWorldBounds = true;
    this.game.physics.enable(this.playerMap[id]);
  }

  getPlayerPosition(id) {
    const player = this.playerMap[id];
    if (player) {
      return { x: player.x, y: player.y };
    } else {
      return null;
    }
  }

  movePlayer(id, x, y) {
    const player = this.playerMap[id];
    if (player) {
      player.body.velocity.x = x * 200;
      player.body.velocity.y = y * 200;
    }
  }

  moveOtherPlayer(id, x, y) {
    const player = this.playerMap[id];
    if (player && player.body) {
      this.game.physics.arcade.moveToXY(player, x, y, 0, 90);
    }
  }

  removePlayer(id) {
    const player = this.playerMap[id];
    if (player) {
      player.destroy();
      delete this.playerMap[id];
    }
  }
}

export default Room;
