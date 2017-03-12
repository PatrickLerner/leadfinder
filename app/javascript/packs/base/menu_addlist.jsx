import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';

import { apiFetch } from '../helpers/api_fetch.js';

export default class MenuAddList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      modalOpen: false
    }
  }

  handleAddClick(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: true
    }));
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: false,
      name: ''
    }));
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleAddConfirmClick(ev) {
    const data = new FormData();
    data.append('list[name]', this.state.name);

    apiFetch('/api/v1/lists', {
      method: 'POST',
      body: data
    }).then(res => res.json()).then(res => {
      if (res.errors) {
        alert('Could not create list');
      } else {
        browserHistory.replace(`/lists/${res.id}`);
        this.handleClose();
      }
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        <Modal isOpen={this.state.modalOpen}
               onRequestClose={this.handleClose.bind(this)}
               contentLabel='Add new list'
               className='modal modal-narrow' overlayClassName='modal-overlay'>
          <h1>Add new list...</h1>
          <p>Lists are a way for you to organize your leads.</p>
          <div className='form-control'>
            <label>Name</label>
            <input className='is-large' type='text' name='name'
                   value={this.state.name} onChange={this.handleInputChange.bind(this)}
                   placeholder='Potential Customers'/>
          </div>
          <a className='button is-large is-full-width' onClick={this.handleAddConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-plus'></i>
            Add List
          </a>
        </Modal>
        <Link className='page-menu-subitem' onClick={this.handleAddClick.bind(this)}>
          <i className='fa fa-fw fa-plus'></i>
          Add List
        </Link>
      </span>
    );
  }
}
