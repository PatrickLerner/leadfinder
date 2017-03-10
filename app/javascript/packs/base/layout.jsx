import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from './header.jsx'
import Menu from './menu.jsx'

export default class Layout extends Component {
  render() {
    const { children } = this.props;

    const isSignedIn = false;

    return (
      <div className='App'>
        <Header />

        <div className='page'>
          <Menu signedIn={isSignedIn} />
          <div className='page-content'>
            { children }
            <footer>
              &copy; { (new Date).getFullYear() } Lead Finder
            </footer>
          </div>
        </div>
      </div>
    );
  }
}
