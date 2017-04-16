import React, { Component } from 'react';

import translate from '../helpers/translate.js';

class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="header-logo" />
        <h1>{this.props.translate('Whistle')}</h1>
      </header>
    );
  }
}

export default translate('Header')(Header);
