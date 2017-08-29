import React, { PropTypes, Component } from 'react';

import style from './GamePage.css';

class EntryPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chatBarEnabled: false,
      chatBarText: "",
    };
  }

  componentDidMount() {
    const { Client } = require('../game/js/main');
    const Game = require('../game/js/main');
    this.client = Client;
    this.game = Game;
  }

  render() {
    return (
      <div>
        <div id="game"></div>
        <div className={style.guiBox}></div>
        <input className={style.chatBar}></input>
      </div>
    );
  }
}

export default EntryPage;
