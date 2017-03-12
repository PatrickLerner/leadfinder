import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';
import { browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';
import DeleteListLink from './list/delete-list-link.jsx';
import RenameListLink from './list/rename-list-link.jsx';
import EntrySearch from './list/entry_search.jsx';
import Entry from './list/entry.jsx';

export default class List extends Component {
  loadList(listId) {
    this.setState(Object.assign({}, this.state, {
      listId,
      loading: true
    }));

    apiFetch(`/api/v1/lists/${listId}`, {
      'method': 'GET'
    }).then(res => res.json()).then(list => {
      this.setState(Object.assign({}, this.state, {
        loading: false,
        list
      }));
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      listId: this.props.params.listId,
      loading: true,
      list: false,
      subscription: null
    }
  }

  componentDidMount() {
    this.loadList(this.props.params.listId);
    this.addChannelSubscription();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.listId !== this.state.listId) {
      this.loadList(nextProps.params.listId);
    }
  }

  addChannelSubscription() {
    const subscription = App.cable.subscriptions.create('ListsChannel', {
      received: ((lists) => {
        const current_list = lists.find(list => list.id === this.state.list.id);
        if (current_list) {
          this.setState(Object.assign({}, this.state, {
            list: Object.assign({}, this.state.list, current_list)
          }));
        }
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

  handleDeleteClick(ev) {
    apiFetch(`/api/v1/lists/${this.state.listId}`, {
      method: 'DELETE'
    }).then(res => {
      browserHistory.replace(`/lists`);
    });
  }

  render() {
    if (this.state.loading) {
      return (<div className='loading-indicator'>
        <i className='fa fa-fw fa-spin fa-circle-o-notch'></i>
      </div>);
    }

    const entries = this.state.list.entries.map(entry => {
      return (<Entry entry={entry} key={entry.id} />);
    });

    let actions = null;
    if (this.state.list.id) {
      actions = (
        <span>
          <DeleteListLink className='page-title-action' listId={this.state.listId} />
          <RenameListLink className='page-title-action' listId={this.state.listId}
                          listName={this.state.list.name} />
        </span>
      );
    }

    return (
      <div>
        <h1 className='page-title'>
          {this.state.list.name}
          {actions}
        </h1>
        <div className='lookup'>
          <EntrySearch />
          {entries}
        </div>
      </div>
    );
  }
}
