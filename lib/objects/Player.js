class Player {
  constructor(id, x, y, game) {
    this.id = id;
    this.game = game;

    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

    this.sprite = this.game.add.sprite(x, y, 'sprite');
    this.sprite.checkWorldBounds = true;
    this.game.physics.enable(this.sprite);
  }

  getPosition() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  moveFromClient(x, y) {
    if (this.sprite.body) {
      this.sprite.body.velocity.x = x * 200;
      this.sprite.body.velocity.y = y * 200;
    }
  }

  moveFromServer(x, y) {
    if (this.sprite.body) {
      this.game.physics.arcade.moveToXY(this.sprite, x, y, 0, 90);
    }
  }

  setSprite(sprite) {
    this.sprite = sprite;
  }

  sendLeftDown() {
    this.left = true;
    this.handleMovement();
  }

  sendLeftUp() {
    this.left = false;
    this.handleMovement();
  }

  sendRightDown() {
    this.right = true;
    this.handleMovement();
  }

  sendRightUp() {
    this.right = false;
    this.handleMovement();
  }

  sendUpDown() {
    this.up = true;
    this.handleMovement();
  }

  sendUpUp() {
    this.up = false;
    this.handleMovement();
  }

  sendDownDown() {
    this.down = true;
    this.handleMovement();
  }

  sendDownUp() {
    this.down = false;
    this.handleMovement();
  }

  handleMovement() {
    if (!this.left && !this.right && !this.up && !this.down) {
      this.moveFromClient(0, 0);
    } else {
      let x;
      let y;

      if (this.left && !this.right) {
        x = -1;
      } else if (this.right && !this.left) {
        x = 1;
      } else {
        x = 0;
      }

      if (this.up && !this.down) {
        y = -1;
      } else if (this.down && !this.up) {
        y = 1;
      } else {
        y = 0;
      }

      this.moveFromClient(x, y);
    }
  }
}

export default Player;