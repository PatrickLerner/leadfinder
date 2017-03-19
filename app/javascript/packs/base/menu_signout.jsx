import React, { Component } from 'react';

import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';

class MenuSignout extends Component {
  signOut() {
    apiFetch('/api/v1/sign_out', {
      method: 'DELETE'
    }).then((res => {
      this.props.onSignOut();
    }).bind(this));
  }

  render() {
    return (
      <a onClick={this.signOut.bind(this)}>
        <i className='fa fa-fw fa-sign-out'></i>
        {this.props.translate('Sign Out')}
      </a>
    );
  }
}

export default translate('MenuSignout')(MenuSignout);
