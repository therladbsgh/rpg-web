/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

import Room2 from './game2';
import GameClass from './GameClass';

import 'pixi';
import 'p2';
import Phaser from 'phaser';

class Room1 extends GameClass {
  preload() {
    super.preload();
    this.game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
  }

  create() {
    const testKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(() => {
      this.client.goToRoom({ room: 'Game2', x: 12 * 32, y: 8 * 32 });
      this.game.state.start('Room2');
    }, this);

    super.create();
  }
}

export default Room1;
