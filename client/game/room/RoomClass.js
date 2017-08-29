import 'pixi';
import 'p2';
import Phaser from 'phaser';
import ArcadeSlopes from '../assets/phaser-arcade-slopes.min';

import Player from '../objects/Player';
import Warp from '../objects/Warp';

class Room {
  constructor(game, client) {
    this.game = game;
    this.client = client;
    this.playerMap = {};
    this.warpMap = {};
  }

  init() {
    this.game.stage.disableVisibilityChange = true;
  }

  preload() {
    this.game.load.image('sprite', 'assets/sprites/sprite.png');
    this.game.load.spritesheet('arcade-slopes-32', 'assets/map/arcade-slopes-32.png', 32, 32);
  }

  create() {
    this.game.time.advancedTiming = true;
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.plugins.add(Phaser.Plugin.ArcadeSlopes);

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

    const enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(() => {
      console.log("ENTER");
    }, this);

    this.backgroundLayer = this.game.add.group();
    this.entityLayer = this.game.add.group();
    this.foregroundLayer = this.game.add.group();
    this.guiLayer = this.game.add.group();
    this.game.world.bringToTop(this.backgroundLayer);
    this.game.world.bringToTop(this.entityLayer);
    this.game.world.bringToTop(this.foregroundLayer);
    this.game.world.bringToTop(this.guiLayer);

    const map = this.game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    map.addTilesetImage('collisions', 'arcade-slopes-32');
    for (let i = 0; i < map.layers.length; i++) {
      if (map.layers[i].name === 'background') {
        const background = map.createLayer(i);
        this.backgroundLayer.add(background);
      } else if (map.layers[i].name === 'foreground') {
        const foreground = map.createLayer(i);
        this.foregroundLayer.add(foreground);
      } else if (map.layers[i].name === 'collisions') {
        this.collisionLayer = map.createLayer(i);
        map.setCollisionBetween(0, 34, true, this.collisionsLayer);
        this.game.slopes.convertTilemapLayer(this.collisionLayer, 'arcadeslopes');
      } else {
        const background = map.createLayer(i);
        this.backgroundLayer.add(background);
      }
    }

    // Create portals
    this.warps = this.game.add.group();
    this.warps.enableBody = true;
    map.objects.warps.forEach((each) => {
      const sprite = this.game.add.sprite(each.x, each.y, 'sprite');
      this.warps.add(sprite);
      if (!this.warpMap[each.x]) {
        this.warpMap[each.x] = {};
      }
      this.warpMap[each.x][each.y] = new Warp(each.properties.room,
                                              each.properties.x, each.properties.y, sprite);
    });

    // Debug collisions
    this.collisionLayer.visible = true;
    this.collisionLayer.debug = true;

    this.client.setGame(this);
    this.client.askNewPlayer();
  }

  render() {
    this.game.debug.text(this.game.time.fps, 2, 14, '#00ff00');
  }

  update() {
    const player = this.playerMap[this.client.getId()];
    if (player && player.sprite) {
      this.game.physics.arcade.collide(player.sprite, this.collisionLayer);
      this.game.physics.arcade.overlap(player.sprite, this.warps, (user, warp) => {
        this.warpToNewRoom(user, warp);
      });
      player.handleMovement();
    }
  }

  warpToNewRoom(player, warp) {
    const warpTo = this.warpMap[warp.position.x][warp.position.y];
    this.client.goToRoom({
      room: warpTo.room,
      x: parseInt(warpTo.x, 10),
      y: parseInt(warpTo.y, 10)
    });
    this.game.state.start(warpTo.room);
  }

  addNewPlayer(id, x, y) {
    this.playerMap[id] = new Player(id, x, y, this.game);
    this.entityLayer.add(this.playerMap[id].sprite);
    if (this.client.getId() === id) {
      this.game.camera.follow(this.playerMap[id].sprite);
    }
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
