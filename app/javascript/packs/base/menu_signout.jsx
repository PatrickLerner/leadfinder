import React, { Component } from 'react';

import { apiFetch } from '../helpers/api_fetch.js';

export default class MenuSignout extends Component {
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
        Sign out
      </a>
    );
  }
}
