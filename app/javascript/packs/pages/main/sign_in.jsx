import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import { apiFetch } from '../../helpers/api_fetch.js';
import LeadFinderLogo from './lead_finder_logo.jsx';

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

  handleLoginClick(ev) {
    ev.preventDefault();

    const data = {
      session: this.state
    };

    apiFetch('/api/v1/session', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
      if (res.errors === undefined) {
        browserHistory.replace('/dashboard');
      } else if (res.errors === 'unconfirmed') {
        browserHistory.replace(`/confirm/email/${this.state.email}`);
      } else {
        this.context.addNotification({ text: 'Your E-Mail or password is incorrect.', class: 'danger' });
      }
    });
  }

  render() {
    return (
      <div className='panel panel-narrow panel-sign-in'>
        <LeadFinderLogo />
        <form onSubmit={this.handleLoginClick.bind(this)}>
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
            <button className='button is-large is-full-width' type='submit'>
              <i className='fa fa-fw fa-sign-in'></i>
              Login
            </button>
          </div>
        </form>
        <footer>
          <a onClick={this.props.switchTab} className='button is-large is-full-width is-delete'>
            Not a member yet? Register now.
          </a>
        </footer>
      </div>
    );
  }
}

SignIn.contextTypes = {
  addNotification: PropTypes.func
};
