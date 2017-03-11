import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

import Header from './header.jsx'
import Menu from './menu.jsx'

export default class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: false
    }
  }

  refreshSignedIn() {
    apiFetch('/api/v1/users', {
      method: 'GET'
    }).then(res => res.json()).then((res => {
      this.setState(Object.assign({}, this.state, {
        signedIn: res.user !== null
      }));
      if (this.state.signedIn) {
        browserHistory.replace('/dashboard')
      }
    }).bind(this));
  }

  componentWillMount() {
    this.refreshSignedIn();
  }

  onSignOut() {
    this.refreshSignedIn();
  }

  render() {
    const { children } = this.props;

    if (this.state.signedIn) {
      return (<div></div>);
    }

    return (
      <div className='page'>
        <Menu onSignOut={this.onSignOut.bind(this)} signedIn={this.state.signedIn} />
        <div className='page-content'>
          { children }
          <footer className='page-footer'>
            &copy; { (new Date).getFullYear() } Lead Finder
          </footer>
        </div>
      </div>
    );
  }
}
