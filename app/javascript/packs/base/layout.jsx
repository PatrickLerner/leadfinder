import React, { Component } from 'react';
import { Link } from 'react-router';

import Header from './header.jsx'

export default class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className='App'>
        <Header />

        <div className='page'>
          <div className='page-menu'>
            <Link to='/dashboard'>
              <i className='fa fa-fw fa-dashboard'></i>
              Dashboard
            </Link>
            <Link to='/lists'>
              <i className='fa fa-fw fa-search'></i>
              Find Leads
            </Link>
            <Link to='/lists'>
              <i className='fa fa-fw fa-list'></i>
              Lead Lists
            </Link>
            <Link className="page-menu-subitem" to='/lists'>
              <i className='fa fa-fw fa-inbox'></i>
              Inbox
            </Link>
            <Link className="page-menu-subitem" to='/lists'>
              <i className='fa fa-fw fa-list'></i>
              Potential Clients
            </Link>
            <Link className="page-menu-subitem" to='/lists'>
              <i className='fa fa-fw fa-plus'></i>
              Add List
            </Link>

            <Link to='/lists'>
              <i className='fa fa-fw fa-question-circle'></i>
              Help &amp; Support
            </Link>
            <Link to='/lists'>
              <i className='fa fa-fw fa-gear'></i>
              Settings
            </Link>
            <Link to='/lists'>
              <i className='fa fa-fw fa-sign-out'></i>
              Sign out
            </Link>
          </div>
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
