import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';
import PasswordReset from '../components/password_reset.jsx';

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: props.params.passwordResetToken,
      password: ''
    }
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleLoginClick() {
    const data = new FormData();
    data.append('password_reset[password]', this.state.password);
    data.append('token', this.state.token);

    apiFetch('/api/v1/passwords', {
      method: 'PATCH',
      body: data
    }).then(res => res.json()).then(res => {
      if (res.errors) {
        alert('Token is invalid.')
      } else {
        browserHistory.replace('/dashboard');
      }
    });
  }

  render() {
    return (
      <div className='panel panel-narrow panel-reset-password'>
        <h1 className='panel-header-title'>Password Reset</h1>
        <p className='panel-header-subtitle'>Enter your new password here.</p>
        <div className='panel-form-control'>
          <label>Password</label>
          <input className='is-large' type='password' name='password'
                 value={this.state.password} onChange={this.handleInputChange.bind(this)}
                 placeholder='*********' />
        </div>
        <div className='panel-button-container'>
          <a className='button is-large' onClick={this.handleLoginClick.bind(this)}>
            <i className='fa fa-fw fa-key'></i>
            Change Password
          </a>
        </div>
      </div>
    );
  }
}
