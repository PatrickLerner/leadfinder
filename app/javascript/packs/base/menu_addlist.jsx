import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import LeadModal from '../components/lead_modal.jsx';
import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';

class MenuAddList extends Component {
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
    ev.preventDefault();

    const data = {
      list: {
        name: this.state.name
      }
    };

    apiFetch('/api/v1/lists', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
      if (data.errors) {
        this.context.addNotification({ text: 'Could not create list', class: 'danger' });
      } else {
        browserHistory.replace(`/lists/${data.list.id}`);
        this.handleClose();
      }
    });
  }

  render() {
    return (
      <span className={this.props.className}>
        <LeadModal isOpen={this.state.modalOpen} onRequestClose={this.handleClose.bind(this)}>
          <h1>{this.props.translate('Add new list...')}</h1>
          <p>{this.props.translate('Lists are a way for you to organize your leads.')}</p>
          <form onSubmit={this.handleAddConfirmClick.bind(this)}>
            <div className='form-control'>
              <label>{this.props.translate('Name')}</label>
              <input className='is-large' type='text' name='name' autoFocus
                     value={this.state.name} onChange={this.handleInputChange.bind(this)}
                     placeholder={this.props.translate('example', 'list name')}/>
            </div>
            <button className='button is-large is-full-width' type='submit'>
              <i className='fa fa-fw fa-plus'></i>
              {this.props.translate('Add List')}
            </button>
          </form>
        </LeadModal>
        <Link className='page-menu-subitem' onClick={this.handleAddClick.bind(this)}>
          <i className='fa fa-fw fa-plus'></i>
          {this.props.translate('Add List')}
        </Link>
      </span>
    );
  }
}

MenuAddList.contextTypes = {
  addNotification: PropTypes.func
};

export default translate('MenuAddList')(MenuAddList);
