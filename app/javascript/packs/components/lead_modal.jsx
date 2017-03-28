import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';

import { apiFetch } from '../helpers/api_fetch.js';

export default class LeadModal extends Component {
  constructor(props) {
    super(props);
    let nextState = Object.assign({}, this.props, {
      size: this.props.size || 'narrow'
    });
    this.state = nextState;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    const { children } = this.state;
    const modalClasses = `modal modal-${this.state.size}`;

    return (
      <Modal isOpen={this.state.isOpen} closeTimeoutMS={200}
             onRequestClose={this.state.onRequestClose}
             contentLabel='modal' className={modalClasses}
             overlayClassName='modal-overlay'>
        {children}
      </Modal>
    );
  }
}
