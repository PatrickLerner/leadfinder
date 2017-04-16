import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import Moment from 'moment';

import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';

class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lists: [],
      loading: true,
      subscription: null
    }
  }

  componentWillMount() {
    const subscription = App.cable.subscriptions.create('ListsChannel', {
      received: ((lists) => {
        this.setState(Object.assign({}, this.state, { lists }));
      }).bind(this)
    });

    apiFetch(`/api/v1/lists`, {
      'method': 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, {
        loading: false,
        lists: data.lists,
        subscription
      }));
    });
  }

  componentWillUnmount() {
    if (this.state.subscription) {
      this.state.subscription.unsubscribe();
    }
  }

  render() {
    if (this.state.loading) {
      return (<div className='loading-indicator'><i className='fa fa-fw fa-spin fa-circle-o-notch'></i></div>);
    }

    const lists = this.state.lists.map(list => {
      return (
        <Link className='list-item' key={list.id} to={`/lists/${list.id}`}>
          <div className='row'>
            <div className='col-12'>
              <h1 className='list-item-header'>{list.name}</h1>
            </div>
            <div className='col-3'>
              <small>
                <strong>{this.props.translate('Created')}:</strong> {Moment(list.created_at).fromNow()}
              </small>
            </div>
            <div className='col-3'>
              <small>
                <strong>{this.props.translate('Leads')}:</strong> {list.entry_count}
              </small>
            </div>
          </div>
        </Link>
      );
    });

    return (
      <div>
        <h1 className='page-title'>{this.props.translate('Lists')}</h1>
        {lists}
      </div>
    );
  }
}

export default translate('Lists')(Lists);
