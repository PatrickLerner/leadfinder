import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Main extends Component {
  render() {
    return (
      <div>
        <div className='panel panel-sign-up'>
          <div className='panel-form-control'>
            <label>E-Mail</label>
            <input className='is-large' type='email' name='email' placeholder='peter.miller@example.com' />
          </div>
          <div className='panel-form-control'>
            <label>Password</label>
            <input className='is-large' type='password' name='password' placeholder='*********' />
          </div>
          <div className='panel-button-container'>
            <a className='button is-large'>
              <i className='fa fa-fw fa-sign-in'></i>
              Sign up
            </a>
          </div>
        </div>
      </div>
    );
  }
}
