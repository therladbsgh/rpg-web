import RoomClass from './RoomClass';

import 'pixi';
import 'p2';
import Phaser from 'phaser';

class Room2 extends RoomClass {
  preload() {
    super.preload();
    this.game.load.tilemap('map', 'assets/map/pokemon_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.spritesheet('tileset', 'assets/map/pokemon.png', 32, 32);
  }

  create() {
    const testKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(() => {
      this.client.goToRoom({ room: 'Game1', x: 12 * 32, y: 8 * 32 });
      this.game.state.start('Room1');
    }, this);

    this.game.world.setBounds(0, 0, 24 * 32, 17 * 32);

    super.create();
  }
}

export default Room2;
