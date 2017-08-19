/**
 * Created by Jerome on 03-03-16.
 */

import 'pixi';
import 'p2';
import Phaser from 'phaser';
import Game from './game';

//noinspection JSCheckFunctionSignatures,JSCheckFunctionSignatures,JSCheckFunctionSignatures
const game = new Phaser.Game(24 * 32, 17 * 32, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game', Game);
game.state.start('Game');

export default game;
