import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import LeadModal from '../../components/lead_modal.jsx';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class RenameListLink extends Component {
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
    const data = {
      list: {
        name: this.state.name
      }
    };

    apiFetch(`/api/v1/lists/${this.state.listId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }).then(res => {
      this.handleClose.bind(this)();
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>{this.props.translate('Rename List')}</h1>
          <p>{this.props.translate('Enter the new name for the list here.')}</p>
          <div className='form-control'>
            <label>{this.props.translate('Name')}</label>
            <input className='is-large' type='text' name='name' autoFocus
                   value={this.state.name} onChange={this.handleInputChange.bind(this)}
                   placeholder={this.props.translate('example', 'list name')} />
          </div>
          <a className='button is-large is-full-width'
             onClick={this.handleRenameConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-pencil'></i>
            {this.props.translate('Rename')}
          </a>
        </LeadModal>
        <a onClick={this.handleRenameClick.bind(this)}>
          <i className='fa fa-fw fa-pencil'></i>
        </a>
      </span>
    );
  }
}

export default translate('RenameListLink')(RenameListLink);
