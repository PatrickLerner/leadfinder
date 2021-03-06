import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';
import { browserHistory } from 'react-router';

import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';
import ExportListLink from './list/export-list-link.jsx';
import DeleteListLink from './list/delete-list-link.jsx';
import ListRenameLink from './list/list-rename-link.jsx';
import ListAssignLink from './list/list-assign-link.jsx';
import EntrySearch from './list/entry_search.jsx';
import Entry from './list/entry.jsx';

class List extends Component {
  loadList(listId, page) {
    this.setState(Object.assign({}, this.state, this.addChannelSubscription(listId), {
      listId,
      page: page,
      loading: true
    }));

    apiFetch(`/api/v1/lists/${listId}?page=${page}`, {
      'method': 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, {
        loading: false,
        list: data.list,
        total_pages: data.list.entries_meta.total_pages
      }));
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      listId: this.props.params.listId,
      page: 1,
      total_pages: 1,
      loading: true,
      list: false,
      subscription: null,
      listSubscription: null
    }
  }

  componentDidMount() {
    this.loadList(this.props.params.listId || 'inbox', 1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.listId !== this.state.listId) {
      this.loadList(nextProps.params.listId || 'inbox', 1);
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
          newState.list.entries.splice(0, 0, update.add);
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

    return { subscription, listSubscription };
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

  previousPage() {
    if (this.state.page == 1) { return; }
    this.loadList(this.state.listId, this.state.page - 1);
  }

  nextPage() {
    if (this.state.page == this.state.total_pages) { return; }
    this.loadList(this.state.listId, this.state.page + 1);
  }


  render() {
    if (this.state.loading) {
      return (<div className='loading-indicator'><i className='fa fa-fw fa-spin fa-circle-o-notch'></i></div>);
    }

    const entries = this.state.list.entries.map(entry => <Entry entry={entry} key={entry.id} />);

    let actions = [];
    actions.push(<ExportListLink key='export' className='page-title-action' listId={this.state.listId} />);
    actions.push(<ListAssignLink key='assign' className='page-title-action' listId={this.state.listId} />);
    if (this.state.list.id) {
      actions.push(<DeleteListLink key='delete' className='page-title-action' listId={this.state.listId} />);
      actions.push(<ListRenameLink key='rename' className='page-title-action' listId={this.state.listId}
                                   listName={this.state.list.name} />);
    }

    let name = this.state.list.name;
    if (name === 'Inbox') {
      name = this.props.translate(name);
    }

    let pagination = null;
    if (this.state.total_pages > 1) {
      pagination = (
        <div className='pagination'>
          <a onClick={this.previousPage.bind(this)} className='pagination-link'
             disabled={this.state.page == 1}>
            <i className='fa fa-fw fa-chevron-left' />
          </a>
          <span className='pagination-number'>
            {this.state.page} / {this.state.total_pages}
          </span>
          <a onClick={this.nextPage.bind(this)} className='pagination-link'
             disabled={this.state.page == this.state.total_pages}>
            <i className='fa fa-fw fa-chevron-right' />
          </a>
        </div>
      );
    }

    return (
      <div>
        <h1 className='page-title'>{name}</h1>
        <div className='page-title-actions'>{actions}</div>
        <EntrySearch listId={this.state.listId} />
        <div className='lookup'>
          {entries}
        </div>
        {pagination}
      </div>
    );
  }
}

export default translate('List')(List);
