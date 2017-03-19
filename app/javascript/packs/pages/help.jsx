import React, { Component } from 'react';

import translate from '../helpers/translate.js';

class Help extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          {this.props.translate('Help & Support')}
        </h1>
        <div className='alert-box is-accent is-large'>
          Sorry, this section does not work yet.
        </div>
      </div>
    );
  }
}

export default translate('Help')(Help);
