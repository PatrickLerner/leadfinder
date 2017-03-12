import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';

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
        <Modal isOpen={this.state.modalOpen}
               onRequestClose={this.handleClose.bind(this)}
               contentLabel='Delete list?'
               className='modal' overlayClassName='modal-overlay'>
          <h1>Are you sure you want to delete this list?</h1>
          <footer className='modal-buttons'>
            <a className='button is-large is-abort' onClick={this.handleClose.bind(this)}>
              <i className='fa fa-fw fa-ban'></i>
              Abort
            </a>
            <a className='button is-large is-delete' onClick={this.handleDeleteConfirmClick.bind(this)}>
              <i className='fa fa-fw fa-trash-o'></i>
              Delete
            </a>
          </footer>
        </Modal>
        <a onClick={this.handleDeleteClick.bind(this)}>
          <i className='fa fa-fw fa-trash-o'></i>
        </a>
      </span>
    );
  }
}
