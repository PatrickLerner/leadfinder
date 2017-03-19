import React, { Component } from 'react';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          Lead Finder
        </h1>
        <div className='alert-box is-accent is-large'>
          This project is in a closed developmental stage. If you somehow are here without knowing this, then you probably should not be here.
          <h1 style={{ textAlign: 'center', fontSize: '4rem', lineHeight: '6rem' }}>😜</h1>
        </div>
      </div>
    );
  }
}
