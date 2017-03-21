import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import LeadModal from '../../components/lead_modal.jsx';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class EntryDeleteLink extends Component {
  setEntry(props) {
    this.state = {
      entryId: props.entryId,
      modalOpen: false
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
    this.handleClose.bind(this)();

    setTimeout(() => {
      apiFetch(`/api/v1/entries/${this.state.entryId}`, {
        method: 'DELETE'
      });
    }, 400);
  }

  render() {
    return (
      <span>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>{this.props.translate('Delete this lead?')}</h1>
          <p>{this.props.translate('This lead will be removed from all lists.')}</p>
          <a className='button is-large is-full-width is-delete'
             onClick={this.handleDeleteConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-trash-o'></i>
            {this.props.translate('Delete')}
          </a>
        </LeadModal>
        <a onClick={this.handleDeleteClick.bind(this)} className='button is-small is-light'>
          <i className='fa fa-trash-o'></i>
          {this.props.translate('Delete')}
        </a>
      </span>
    );
  }
}

export default translate('EntryDeleteLink')(EntryDeleteLink);
