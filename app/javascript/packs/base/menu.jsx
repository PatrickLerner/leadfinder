import React, { Component } from 'react';
import { Link } from 'react-router';

import MenuSignout from './menu_signout.jsx'

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: props.signedIn
    };
  }

  componentWillReceiveProps(props) {
    if (props.signedIn === this.state.signedIn) {
      return;
    }
    this.setState({
      signedIn: props.signedIn
    });
  }

  render() {
    if (!this.state.signedIn) {
      return (
        <div></div>
      );
    }

    return (
      <div className='page-menu'>
        <Link to='/dashboard'>
          <i className='fa fa-fw fa-dashboard'></i>
          Dashboard
        </Link>
        <Link to='/dashboard'>
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

        <Link to='/dashboard'>
          <i className='fa fa-fw fa-question-circle'></i>
          Help &amp; Support
        </Link>
        <Link to='/dashboard'>
          <i className='fa fa-fw fa-gear'></i>
          Settings
        </Link>

        <MenuSignout onSignOut={this.props.onSignOut} />
      </div>
    );
  }
}
