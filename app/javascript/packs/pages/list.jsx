import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';
import { browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

export default class List extends Component {
  loadList(listId) {
    this.state = {
      listId,
      loading: true,
      list: false
    }

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
    this.loadList(this.props.params.listId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.listId !== this.state.listId) {
      this.loadList(nextProps.params.listId);
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

    return (
      <div>
        <h1 className='page-title'>
          {this.state.list.name}
          <a className='page-title-action' onClick={this.handleDeleteClick.bind(this)}>
            <i className='fa fa-fw fa-trash-o'></i>
          </a>
        </h1>
        <div className='lookup'>
        </div>
      </div>
    );
  }
}
