import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import FileSaver from 'file-saver';

import LeadModal from '../../components/lead_modal.jsx';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class ListAssignLink extends Component {
  setList(listId) {
    this.state = {
      listId,
      selectedListId: listId,
      modalOpen: false,
      lists: [],
    }
  }

  constructor(props) {
    super(props);
    this.setList(props.listId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listId !== this.state.listId) {
      this.setList(nextProps.params.listId);
    }
  }

  handleAssignClick(ev) {
    this.setState(Object.assign({}, this.state, { modalOpen: true }));
    apiFetch(`/api/v1/lists`, {
      method: 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, {
        lists: data.lists,
        modalOpen: true
      }));
    });
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, { modalOpen: false }));
  }

  handleListSelection(ev) {
    this.setState(Object.assign({}, this.state, { selectedListId: ev.target.value }));
  }

  handleAssignConfirmClick(ev) {
    this.setState(Object.assign({}, this.state, { modalOpen: true }));
    apiFetch(`/api/v1/lists/${this.state.listId}/reassign`, {
      method: 'POST',
      body: JSON.stringify({ listId: this.state.selectedListId })
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, { modalOpen: false }));
      browserHistory.replace(`/lists/${this.state.selectedListId}`);
    });
  }

  render() {
    let lists = null;
    if (this.state.lists) {
      lists = this.state.lists.map(list =>
        <option value={list.id} key={list.id}>
          {list.name}
        </option>
      );
      lists = [<option value='inbox' key='inbox'>{this.props.translate('List', 'Inbox')}</option>].concat(lists);
    }

    return (
      <span className={this.props.className}>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>{this.props.translate('Reassign all leads')}</h1>
          <p>{this.props.translate('All leads in this list will be moved to a different list')}</p>

          <div className='form-control'>
            <select onChange={this.handleListSelection.bind(this)} value={this.state.selectedListId}>
              {lists}
            </select>
          </div>

          <a className='button is-large is-full-width'
             onClick={this.handleAssignConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-arrow-right'></i>
            {this.props.translate('Reassign all')}
          </a>
        </LeadModal>
        <a onClick={this.handleAssignClick.bind(this)}>
          <i className='fa fa-fw fa-arrow-right'></i> {this.props.translate('Assign all')}
        </a>
      </span>
    );
  }
}

export default translate('ListAssignLink')(ListAssignLink);
