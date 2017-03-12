import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';

import { apiFetch } from '../../helpers/api_fetch.js';

export default class RenameListLink extends Component {
  setList(props) {
    this.state = {
      listId: props.listId,
      modalOpen: false,
      name: props.listName
    }
  }

  constructor(props) {
    super(props);
    this.setList(props);
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.listId !== this.state.listId) {
      this.setList(nextProps);
    }
  }

  handleRenameClick(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: true
    }));
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: false,
      name: this.props.listName
    }));
  }

  handleRenameConfirmClick(ev) {
    const data = new FormData();
    data.append('list[name]', this.state.name);

    apiFetch(`/api/v1/lists/${this.state.listId}`, {
      method: 'PATCH',
      body: data
    }).then(res => {
      this.handleClose.bind(this)();
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        <Modal isOpen={this.state.modalOpen}
               onRequestClose={this.handleClose.bind(this)}
               contentLabel='Rename list'
               className='modal modal-narrow' overlayClassName='modal-overlay'>
          <h1>Rename list</h1>
          <p>Enter the new name for the list here.</p>
          <div className='form-control'>
            <label>Name</label>
            <input className='is-large' type='text' name='name'
                   value={this.state.name} onChange={this.handleInputChange.bind(this)}
                   placeholder='Potential Customers'/>
          </div>
          <a className='button is-large is-full-width'
             onClick={this.handleRenameConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-pencil'></i>
            Rename
          </a>
        </Modal>
        <a onClick={this.handleRenameClick.bind(this)}>
          <i className='fa fa-fw fa-pencil'></i>
        </a>
      </span>
    );
  }
}
