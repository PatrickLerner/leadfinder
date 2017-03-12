import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

export default class PasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      sent: false
    };
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleResetClick() {
    if (this.state.email.indexOf('@') === -1) {
      return;
    }
    const data = new FormData();
    data.append('password[email]', this.state.email);

    apiFetch('/api/v1/passwords', {
      method: 'POST',
      body: data
    }).then(res => {
      this.setState(Object.assign({}, this.state, {
        sent: true
      }))
    });
  }

  render() {
    let content = '';
    if (this.state.sent) {
      content = (
        <div>
          Thank you. An email to reset your password will be send to you at '{this.state.email}'.
        </div>
      )
    } else {
      content = (
        <div>
          <div className='panel-form-control'>
            <label>E-Mail</label>
            <input className='is-large' type='email' name='email'
                   value={this.state.email} onChange={this.handleInputChange.bind(this)}
                   placeholder='peter.miller@example.com'/>
          </div>
          <div className='panel-button-container'>
            <a className='button is-large' onClick={this.handleResetClick.bind(this)}>
              <i className='fa fa-fw fa-key'></i>
              Reset
            </a>
          </div>
        </div>
      )
    }
    return (
      <div className='panel panel-narrow panel-password-reset'>
        <h1 className='panel-header-title'>Password Reset</h1>
        <p className='panel-header-subtitle'>Enter your email to reset your password.</p>
        {content}
        <footer>
          <a onClick={this.props.switchTab}>Remember your password? Login now.</a>
        </footer>
      </div>
    );
  }
}
