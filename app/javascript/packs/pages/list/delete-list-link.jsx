import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import LeadModal from '../../components/lead_modal.jsx';
import { apiFetch } from '../../helpers/api_fetch.js';

export default class DeleteListLink extends Component {
  setList(listId) {
    this.state = {
      listId,
      modalOpen: false
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

  handleDeleteClick(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: true
    }));
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: false
    }));
  }

  handleDeleteConfirmClick(ev) {
    apiFetch(`/api/v1/lists/${this.state.listId}`, {
      method: 'DELETE'
    }).then(res => {
      browserHistory.replace(`/lists`);
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>Delete this list?</h1>
          <p>This list will be deleted and all leads not contained in any other list will be moved to your inbox.</p>

          <a className='button is-large is-delete is-full-width'
             onClick={this.handleDeleteConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-trash-o'></i>
            Delete
          </a>
        </LeadModal>
        <a onClick={this.handleDeleteClick.bind(this)}>
          <i className='fa fa-fw fa-trash-o'></i>
        </a>
      </span>
    );
  }
}
