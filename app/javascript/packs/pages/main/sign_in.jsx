import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { apiFetch } from '../../helpers/api_fetch.js';

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleLoginClick() {
    const data = new FormData();
    data.append('session[email]', this.state.email);
    data.append('session[password]', this.state.password);

    apiFetch('/api/v1/session', {
      method: 'POST',
      body: data
    }).then(res => {
      browserHistory.replace('/dashboard');
    });
  }

  render() {
    return (
      <div className='panel panel-narrow panel-sign-in'>
        <h1 className='panel-header-title'>Login</h1>
        <p className='panel-header-subtitle'>Great to have you back.</p>
        <div className='form-control'>
          <label>E-Mail</label>
          <input className='is-large' type='email' name='email' autoFocus
                 value={this.state.email} onChange={this.handleInputChange.bind(this)}
                 placeholder='peter.miller@example.com'/>
        </div>
        <div className='form-control'>
          <label>Password</label>
          <input className='is-large' type='password' name='password'
                 value={this.state.password} onChange={this.handleInputChange.bind(this)}
                 placeholder='*********' />
        </div>
        <a className='forgot-password-link' onClick={this.props.resetPassword}>Forgot your password?</a>
        <div className='panel-button-container'>
          <a className='button is-large is-full-width' onClick={this.handleLoginClick.bind(this)}>
            <i className='fa fa-fw fa-sign-in'></i>
            Login
          </a>
        </div>
        <footer>
          <a onClick={this.props.switchTab}>Not a member yet? Register now.</a>
        </footer>
      </div>
    );
  }
}
