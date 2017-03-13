import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import LeadModal from '../../components/lead_modal.jsx';
import { apiFetch } from '../../helpers/api_fetch.js';

export default class EntryListLink extends Component {
  setEntry(props) {
    this.state = {
      entryId: props.entryId,
      modalOpen: false,
      lists: []
    }
  }

  constructor(props) {
    super(props);
    this.setEntry(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entryId !== this.state.entryId) {
      this.setEntry(nextProps);
    }
  }

  handleListClick(ev) {
    apiFetch(`/api/v1/entries/${this.state.entryId}/lists`, {
      method: 'GET'
    }).then(res => res.json()).then(lists => {
      this.setState(Object.assign({}, this.state, {
        lists,
        modalOpen: true
      }));
    });
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: false
    }));
  }

  handleListConfirmClick(ev) {
    const data = new FormData();
    this.state.lists.filter(list => list.included).forEach(list => {
      data.append('entry[lists][]', list.id);
    });

    this.handleClose.bind(this)();

    setTimeout(() => {
      apiFetch(`/api/v1/entries/${this.state.entryId}/lists`, {
        method: 'PATCH',
        body: data
      });
    }, 400);
  }

  handleCheckedToggleClick(listId) {
    this.setState(Object.assign({}, this.state, {
      lists: this.state.lists.map(list => {
        if (list.id == listId) {
          return Object.assign({}, list, {
            included: !list.included
          });
        } else {
          return list;
        }
      })
    }));
  }

  render() {
    const lists = this.state.lists.map(list => {
      let classes = ['fa', 'fa-fw', 'fa-check'];
      if (list.included) {
        classes.push('is-checked');
      }
      const check = (
        <i className={classes.join(' ')}></i>
      );
      return (
        <div className='checkmark-list-itme' key={list.id}
             onClick={this.handleCheckedToggleClick.bind(this, list.id)}>
          {check}
          {list.name}
        </div>
      );
    });

    return (
      <span>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>Assign to lists</h1>
          <p>Assign this lead to lists. If a lead is not assigned to any lists, then it will appear in your inbox.</p>
          <div className='checkmark-list'>
            {lists}
          </div>
          <a className='button is-large is-full-width'
             onClick={this.handleListConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-arrow-right'></i>
            Assign
          </a>
        </LeadModal>
        <a onClick={this.handleListClick.bind(this)} className='button is-small is-light'>
          <i className='fa fa-list'></i>
          In Lists
        </a>
      </span>
    );
  }
}