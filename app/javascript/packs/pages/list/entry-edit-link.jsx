import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import LeadModal from '../../components/lead_modal.jsx';
import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class EntryEditLink extends Component {
  setEntry(props) {
    this.state = {
      entryId: props.entryId,
      modalOpen: false,
      entry: null
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

  handleEditClick(ev) {
    apiFetch(`/api/v1/entries/${this.state.entryId}`, {
      method: 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, {
        entry: {
          title: data.entry.title || '',
          first_name: data.entry.first_name || '',
          middle_name: data.entry.middle_name || '',
          last_name: data.entry.last_name || '',
          position: data.entry.position || '',
          company_name: data.entry.company || '',
          domain: data.entry.domain || '',
          email: data.entry.email || '',
        },
        modalOpen: true
      }));
    });
  }

  handleClose(ev) {
    this.setState(Object.assign({}, this.state, {
      modalOpen: false
    }));
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState.entry[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleKeyPress(ev) {
    if (ev.key === 'Enter') {
      this.handleEditConfirmClick(ev);
    }
  }


  handleEditConfirmClick(ev) {
    const data = { entry: this.state.entry };

    apiFetch(`/api/v1/entries/${this.state.entryId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
      if (data.errors) {
        alert('error');
      } else {
        this.handleClose.bind(this)();
      }
    });
  }

  render() {
    let modal = null;
    if (this.state.entry !== null) {
      modal = (
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)} size='normal'>
          <h1>{this.props.translate('Edit lead')}</h1>
          <p>{this.props.translate('Change the details of this lead to get accurate results.')}</p>

          <div className='row'>
            <div className='col-12 col-lg-4'>
              <div className='form-control'>
                <label htmlFor='entry_edit_title'>{this.props.translate('user', 'Title')}</label>
                <input className='is-large' type='text' name='title' id='entry_edit_title'
                       value={this.state.entry.title} onChange={this.handleInputChange.bind(this)}
                       placeholder='Dr., Prof., ...' onKeyPress={this.handleKeyPress.bind(this)} />
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-12 col-lg-4'>
              <div className='form-control'>
                <label htmlFor='entry_edit_first_name'>{this.props.translate('user', 'First Name')}</label>
                <input className='is-large' type='text' name='first_name' autoFocus id='entry_edit_first_name'
                       value={this.state.entry.first_name} onChange={this.handleInputChange.bind(this)}
                       placeholder='First name' onKeyPress={this.handleKeyPress.bind(this)} />
              </div>
            </div>
            <div className='col-12 col-lg-4'>
              <div className='form-control'>
                <label htmlFor='entry_edit_first_name'>{this.props.translate('user', 'Middle Name')}</label>
                <input className='is-large' type='text' name='middle_name' id='entry_edit_middle_name'
                       value={this.state.entry.middle_name} onChange={this.handleInputChange.bind(this)}
                       placeholder='Middle name' onKeyPress={this.handleKeyPress.bind(this)} />
              </div>
            </div>
            <div className='col-12 col-lg-4'>
              <div className='form-control'>
                <label htmlFor='entry_edit_last_name'>{this.props.translate('user', 'Last Name')}</label>
                <input className='is-large' type='text' name='last_name' id='entry_edit_last_name'
                       value={this.state.entry.last_name} onChange={this.handleInputChange.bind(this)}
                       placeholder='Last name' onKeyPress={this.handleKeyPress.bind(this)} />
              </div>
            </div>
          </div>

          <div className='form-control'>
            <label htmlFor='position'>{this.props.translate('user', 'Position')}</label>
            <input className='is-large' type='text' name='position' id='entry_edit_position'
                   value={this.state.entry.position} onChange={this.handleInputChange.bind(this)}
                   placeholder='CEO, CTO, ...' onKeyPress={this.handleKeyPress.bind(this)} />
          </div>

          <div className='form-control'>
            <label htmlFor='entry_edit_company_name'>{this.props.translate('user', 'Company')}</label>
            <input className='is-large' type='text' name='company_name' id='entry_edit_company_name'
                   value={this.state.entry.company_name} onChange={this.handleInputChange.bind(this)}
                   placeholder='Miller & Son Corp.' onKeyPress={this.handleKeyPress.bind(this)} />
          </div>

          <div className='form-control'>
            <label htmlFor='entry_edit_domain'>{this.props.translate('user', 'Domain')}</label>
            <input className='is-large' type='text' name='domain' id='entry_edit_domain'
                   value={this.state.entry.domain} onChange={this.handleInputChange.bind(this)}
                   placeholder='example.com' onKeyPress={this.handleKeyPress.bind(this)} />
          </div>

          <div className='form-control'>
            <label htmlFor='entry_edit_email'>{this.props.translate('user', 'E-Mail')}</label>
            <input className='is-large' type='text' name='email' id='entry_edit_email'
                   value={this.state.entry.email} onChange={this.handleInputChange.bind(this)}
                   placeholder='peter.miller@example.com' onKeyPress={this.handleKeyPress.bind(this)} />
          </div>

          <a className='button is-large is-full-width'
             onClick={this.handleEditConfirmClick.bind(this)}>
            <i className='fa fa-fw fa-save'></i>
            {this.props.translate('Save')}
          </a>
        </LeadModal>
      );
    }
    return (
      <div className='lookup-button'>
        {modal}
        <a onClick={this.handleEditClick.bind(this)} className='button is-small is-light'>
          <i className='fa fa-pencil'></i>
          {this.props.translate('Edit')}
        </a>
      </div>
    );
  }
}

export default translate('EntryEditLink')(EntryEditLink);
