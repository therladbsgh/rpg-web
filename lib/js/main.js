/**
 * Created by Jerome on 03-03-16.
 */

import 'pixi';
import 'p2';
import Phaser from 'phaser';

import Room1 from '../room/game';
import Room2 from '../room/game2';
import client from './client';

//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
const game = new Phaser.Game(24 * 32, 17 * 32, Phaser.AUTO, document.getElementById('game'));
game.state.add('Room1', new Room1(game, client));
game.state.add('Room2', new Room2(game, client));
game.state.start('Room1');

export default game;
