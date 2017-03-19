import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';
import { browserHistory } from 'react-router';

import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';
import DeleteListLink from './list/delete-list-link.jsx';
import RenameListLink from './list/rename-list-link.jsx';
import EntrySearch from './list/entry_search.jsx';
import Entry from './list/entry.jsx';

class List extends Component {
  loadList(listId) {
    this.setState(Object.assign({}, this.state, this.addChannelSubscription(listId), {
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
      subscription: null,
      listSubscription: null
    }
  }

  componentDidMount() {
    this.loadList(this.props.params.listId || 'inbox');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.listId !== this.state.listId) {
      this.loadList(nextProps.params.listId || 'inbox');
    }
  }

  addChannelSubscription(listId) {
    this.removeChannelSubscriptions();
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

    const listSubscription = App.cable.subscriptions.create({
      channel: 'ListChannel',
      listId
    }, {
      received: ((update) => {
        const newState = Object.assign({}, this.state);
        if (update.add) {
          newState.list.entries.push(update.add);
          this.setState(newState);
        }
        if (update.remove) {
          newState.list.entries = newState.list.entries.filter(entry => {
            return entry.id !== update.remove.id;
          });
        }
        if (update.update) {
          newState.list.entries = newState.list.entries.map(entry => {
            if (entry.id === update.update.id) {
              return update.update;
            } else {
              return entry;
            }
          });
        }
        this.setState(newState);
      }).bind(this)
    });

    return {
      subscription, listSubscription
    };
  }

  componentWillUnmount() {
    this.removeChannelSubscriptions();
  }

  removeChannelSubscriptions() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
    if (this.state.listSubscription) {
      this.state.listSubscription.unsubscribe();
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

    let name = this.state.list.name;
    if (name === 'Inbox') {
      name = this.props.translate(name);
    }

    return (
      <div>
        <h1 className='page-title'>
          {name}
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

export default translate('List')(List);
