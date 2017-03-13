import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { apiFetch } from '../../helpers/api_fetch.js';

export default class EntrySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      company: '',
    };
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleSearchClick() {
    const data = new FormData();
    data.append('entry[first_name]', this.state.first_name);
    data.append('entry[last_name]', this.state.last_name);
    data.append('entry[company]', this.state.company);

    apiFetch('/api/v1/entries', {
      method: 'POST',
      body: data
    }).then(res => {
      this.setState(Object.assign({}, this.state, {
        first_name: '',
        last_name: '',
        company: ''
      }));
    });
  }

  render() {
    return (
      <div className='panel panel-entry-search'>
        <div className='row'>
          <div className='col-12 col-lg-3'>
            <div className='form-control'>
              <label>First Name</label>
              <input className='is-large' type='text' name='first_name' autoFocus
                     value={this.state.first_name} onChange={this.handleInputChange.bind(this)}
                     placeholder='Peter' />
            </div>
          </div>
          <div className='col-12 col-lg-3'>
            <div className='form-control'>
              <label>Last Name</label>
              <input className='is-large' type='text' name='last_name'
                     value={this.state.last_name} onChange={this.handleInputChange.bind(this)}
                     placeholder='Miller' />
            </div>
          </div>
          <div className='col-12 col-lg-3'>
            <div className='form-control'>
              <label>Company</label>
              <input className='is-large' type='text' name='company'
                     value={this.state.company} onChange={this.handleInputChange.bind(this)}
                     placeholder='Miller & Son Corp.' />
            </div>
          </div>
          <div className='col-12 col-lg-3'>
            <div className='form-control'>
              <label>&nbsp;</label>
              <a className='button is-large is-full-width' onClick={this.handleSearchClick.bind(this)}>
                <i className='fa fa-fw fa-search'></i>
                Search
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
