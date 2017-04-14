import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

export default class ConfirmMail extends Component {
  constructor(props) {
    super(props);
    const token = props.params.confirmationToken !== 'email' ? props.params.confirmationToken : null;
    this.state = {
      token: token,
      email: props.params.email,
      success: false,
      loading: true,
      resend: false
    };
  }

  componentDidMount() {
    if (!this.state.token) { return; }
    apiFetch('/api/v1/confirm', {
      method: 'PATCH',
      body: JSON.stringify({ token: this.state.token })
    }).then(res => res.json()).then(res => {
      this.setState(Object.assign({}, this.state, {
        loading: false,
        success: res.errors == undefined
      }));
    });
  }

  resendConfirmation() {
    apiFetch('/api/v1/confirm', {
      method: 'POST',
      body: JSON.stringify({ email: this.state.email })
    }).then(res => res.json()).then(res => {
      this.setState(Object.assign({}, this.state, { resend: true }));
    });
  }

  render() {
    if (!this.state.token) {
      let button = null;
      if (!this.state.resend) {
        button = (
          <a className='button is-large is-full-width' onClick={this.resendConfirmation.bind(this)}>
            <i className='fa fa-fw fa-chevron-right is-full-size'></i>
            Send E-Mail again
          </a>
        );
      } else {
        button = (
          <a className='button is-large is-full-width' disabled>
            <i className='fa fa-fw fa-check is-full-size'></i>
            E-Mail was send again
          </a>
        );
      }
      return (
        <div className='panel panel-narrow panel-reset-password'>
          <h1 className='panel-header-title'>E-Mail Confirmation</h1>
          <p className='panel-header-subtitle'>In order to get started, you need to confirm you email.</p>
          <p>An email was send to your address to confirm it. Please click the link within to use your account.</p>
          <div className='panel-button-container'>
            {button}
          </div>
        </div>
      );
    }
    if (this.state.loading) { return (<div></div>); }
    if (this.state.success) {
      return (
        <div className='panel panel-narrow panel-reset-password'>
          <h1 className='panel-header-title'>E-Mail Confirmed</h1>
          <p className='panel-header-subtitle'>Your E-Mail was confirmed. You are now signed in.</p>
          <div className='panel-button-container'>
            <Link className='button is-large is-full-width' to='/dashboard'>
              <i className='fa fa-fw fa-chevron-right is-full-size'></i>
              To the dashboard
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className='panel panel-narrow panel-reset-password'>
          <h1 className='panel-header-title'>E-Mail could not be confirmed</h1>
          <p className='panel-header-subtitle'>We could not authorize your account.</p>
          <div className='panel-button-container'>
            <Link className='button is-large is-full-width' to='/'>
              <i className='fa fa-fw fa-chevron-right is-full-size'></i>
              To login
            </Link>
          </div>
        </div>
      );
    }
  }
}
