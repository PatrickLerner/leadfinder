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

  handleLoginClick(ev) {
    ev.preventDefault();

    const data = {
      session: this.state
    };

    apiFetch('/api/v1/session', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => {
      if (res.status === 200) {
        browserHistory.replace('/dashboard');
      } else {
        alert('Login failed');
      }
    });
  }

  render() {
    return (
      <div className='panel panel-narrow panel-sign-in'>
        <div className='row'>
          <div className='col-5'>
            <div className='lead-logo-md'></div>
          </div>
          <div className='col-7'>
            <div className='lead-title-md'>Lead Finder</div>
          </div>
        </div>
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
