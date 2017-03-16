import React, { Component } from 'react';

export default class Settings extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          Settings
        </h1>

        <div className='form-control'>
          <label>Region</label>
          <div className='flag flag-de'></div>
          <div className='flag flag-en'></div>
        </div>
      </div>
    );
  }
}
