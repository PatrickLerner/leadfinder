import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { apiFetch } from '../../helpers/api_fetch.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      gender: 'male',
      showPassword: false
    };
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  togglePassword() {
    this.setState(Object.assign({}, this.state, {
      showPassword: !this.state.showPassword
    }));
  }

  handleRegistrationClick(ev) {
    ev.preventDefault();

    const data = {
      user: {
        gender: this.state.gender,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password
      }
    };

    apiFetch('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
      if (res.user) {
        browserHistory.replace('/dashboard');
      } else {
        alert('Sign up not successful.')
      }
    });
  }

  render() {
    const toggleClass = `fa fa-fw fa-eye${this.state.showPassword ? '-slash' : ''}`;
    const showPassword = (
      <a onClick={this.togglePassword.bind(this)} className='u-pull-right'>
        {this.state.showPassword ? 'Hide' : 'Show'}
        <i className={toggleClass}></i>
      </a>
    );
    return (
      <div className='panel panel-narrow panel-sign-up'>
        <h1 className='panel-header-title'>Register</h1>
        <p className='panel-header-subtitle'>Just enter some of your details and join us now for free.</p>
        <form onSubmit={this.handleRegistrationClick.bind(this)}>
          <div className='row'>
            <div className='col-12 col-lg-6'>
              <div className='form-control'>
                <label>
                  <input type='radio' value='male' name='gender' checked={this.state.gender === 'male'}
                         onChange={this.handleInputChange.bind(this)} />
                  Mr.
                </label>
                <label>
                  <input type='radio' value='female' name='gender' checked={this.state.gender === 'female'}
                         onChange={this.handleInputChange.bind(this)} />
                  Mrs.
                </label>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-12 col-lg-6'>
              <div className='form-control'>
                <label>First Name</label>
                <input className='is-large' type='text' name='first_name' autoFocus
                       value={this.state.first_name} onChange={this.handleInputChange.bind(this)}
                       placeholder='Peter' />
              </div>
            </div>
            <div className='col-12 col-lg-6'>
              <div className='form-control'>
                <label>Last Name</label>
                <input className='is-large' type='text' name='last_name'
                       value={this.state.last_name} onChange={this.handleInputChange.bind(this)}
                       placeholder='Miller' />
              </div>
            </div>
          </div>
          <div className='form-control'>
            <label>E-Mail</label>
            <input className='is-large' type='email' name='email'
                   value={this.state.email} onChange={this.handleInputChange.bind(this)}
                   placeholder='peter.miller@example.com' />
          </div>
          <div className='form-control'>
            <label>
              Password
              {showPassword}
            </label>
            <input className='is-large' type={this.state.showPassword ? 'text' : 'password'} name='password'
                   value={this.state.password} onChange={this.handleInputChange.bind(this)}
                   placeholder='*********' />
          </div>
          <div className='panel-button-container'>
            <button className='button is-large is-full-width' type='submit'>
              <i className='fa fa-fw fa-user-plus'></i>
              Register
            </button>
          </div>
        </form>
        <footer>
          <a onClick={this.props.switchTab} className='button is-large is-full-width is-delete'>
            Already a member? Login now.
          </a>
        </footer>
      </div>
    );
  }
}
