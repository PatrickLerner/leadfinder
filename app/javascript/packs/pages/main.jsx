import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      first_name: '',
      last_name: ''
    };
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleRegistrationClick() {
    const data = new FormData();
    data.append('first_name', this.state.first_name);
    data.append('last_name', this.state.first_name);
    data.append('email', this.state.email);
    data.append('password', this.state.password);
    data.append('password_confirmation', this.state.password);

    fetch('/users.json', {
      method: 'POST',
      body: data
    }).then(res => {
      debugger;
    });
  }

  render() {
    return (
      <div>
        <div className='panel panel-sign-up'>
          <div className='row'>
            <div className='col-sm-6 col-12'>
              <label>First name</label>
              <input className='is-large' type='text' name='first_name'
                     value={this.state.first_name} onChange={this.handleInputChange.bind(this)}
                     placeholder='Peter' />
            </div>
            <div className='col-sm-6 col-12'>
              <label>Last name</label>
              <input className='is-large' type='text' name='last_name'
                     value={this.state.last_name} onChange={this.handleInputChange.bind(this)}
                     placeholder='Miller' />
            </div>
          </div>
          <div className='panel-form-control'>
            <label>E-Mail</label>
            <input className='is-large' type='email' name='email'
                   value={this.state.email} onChange={this.handleInputChange.bind(this)}
                   placeholder='peter.miller@example.com'/>
          </div>
          <div className='panel-form-control'>
            <label>Password</label>
            <input className='is-large' type='password' name='password'
                   value={this.state.password} onChange={this.handleInputChange.bind(this)}
                   placeholder='*********' />
          </div>
          <div className='panel-button-container'>
            <a className='button is-large' onClick={this.handleRegistrationClick.bind(this)}>
              <i className='fa fa-fw fa-sign-in'></i>
              Sign up
            </a>
          </div>
        </div>
      </div>
    );
  }
}
