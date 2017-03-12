import React, { Component } from 'react';
import { Link } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';
import MenuSignout from './menu_signout.jsx'
import MenuAddList from './menu_addlist.jsx'

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signedIn: props.signedIn,
      lists: [],
      subscription: null
    };

    if (this.state.signedIn) {
      apiFetch('/api/v1/lists', {
        'method': 'GET'
      }).then(res => res.json()).then(lists => {
        this.setState(Object.assign({}, this.state, { lists }));
        this.addChannelSubscription()
      });
    }
  }

  addChannelSubscription() {
    const subscription = App.cable.subscriptions.create('ListsChannel', {
      received: ((lists) => {
        this.setState(Object.assign({}, this.state, {
          lists
        }));
      }).bind(this)
    });

    this.setState(Object.assign({}, this.state, {
      subscription
    }));
  }

  componentWillUnmount() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
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

    const listLinks = this.state.lists.map(list => {
      return (
        <Link className="page-menu-subitem" to={`/lists/` + list.id} key={list.id}>
          <i className='fa fa-fw fa-list'></i>
          {list.name}
        </Link>
      );
    });

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
        <Link className="page-menu-subitem" to='/lists/inbox'>
          <i className='fa fa-fw fa-inbox'></i>
          Inbox
        </Link>
        {listLinks}

        <MenuAddList />
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
