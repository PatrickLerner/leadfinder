import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Modal from 'react-modal';

import { apiFetch } from '../helpers/api_fetch.js';

export default class LeadModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    const { children } = this.state;

    return (
      <Modal isOpen={this.state.isOpen} closeTimeoutMS={200}
             onRequestClose={this.state.onRequestClose}
             contentLabel='modal' className='modal modal-narrow'
             overlayClassName='modal-overlay'>
        {children}
      </Modal>
    );
  }
}
