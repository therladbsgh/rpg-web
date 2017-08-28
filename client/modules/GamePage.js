import React, { PropTypes, Component } from 'react';

class EntryPage extends Component {

  componentDidMount() {
    require('../game/js/index');
  }

  render() {
    return (
      <div id="game"></div>
    );
  }
}

export default EntryPage;
