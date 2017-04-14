import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import translate from '../../helpers/translate.js';
import { apiFetch } from '../../helpers/api_fetch.js';

class EntrySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      company_name: '',
      lists: [props.listId]
    };
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleKeyPress(ev) {
    if (ev.key === 'Enter') {
      this.handleSearchClick(ev);
    }
  }

  handleSearchClick(ev) {
    ev.preventDefault();

    const data = { entry: this.state }

    apiFetch('/api/v1/entries', {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(res => res.json()).then(res => {
      if (res.errors) {
        alert('Error');
      } else {
        this.setState(Object.assign({}, this.state, {
          name: '',
          company_name: ''
        }));
      }
    });
  }

  render() {
    return (
      <div className='panel panel-entry-search'>
        <div className='row'>
          <div className='col-12 col-lg-4'>
            <div className='form-control'>
              <label htmlFor='entry_search_first_name'>{this.props.translate('user', 'Name')}</label>
              <input className='is-large' type='text' name='name' autoFocus id='entry_search_name'
                     value={this.state.name} onChange={this.handleInputChange.bind(this)}
                     placeholder='Peter Miller' onKeyPress={this.handleKeyPress.bind(this)} />
            </div>
          </div>
          <div className='col-12 col-lg-4'>
            <div className='form-control'>
              <label htmlFor='entry_search_company_name'>{this.props.translate('user', 'Company')}</label>
              <input className='is-large' type='text' name='company_name' id='entry_search_company_name'
                     value={this.state.company_name} onChange={this.handleInputChange.bind(this)}
                     placeholder='Miller & Son Corp.' onKeyPress={this.handleKeyPress.bind(this)} />
            </div>
          </div>
          <div className='col-12 col-lg-4'>
            <div className='form-control'>
              <label>&nbsp;</label>
              <a className='button is-large is-full-width' onClick={this.handleSearchClick.bind(this)}>
                <i className='fa fa-fw fa-search'></i>
                {this.props.translate('Search')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate('EntrySearch')(EntrySearch);
