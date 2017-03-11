import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';
import { browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

export default class ListNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  handleAddClick(ev) {
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
      }
    });
  }

  render() {
    return (
      <div className='panel panel-narrow'>
        <h1 className='panel-header-title'>Add new list...</h1>
        <p className='panel-header-subtitle'>Lists are a way for you to organize your leads.</p>
        <div className='panel-form-control'>
          <label>Name</label>
          <input className='is-large' type='text' name='name'
                 value={this.state.name} onChange={this.handleInputChange.bind(this)}
                 placeholder='Potential Customers'/>
        </div>
        <div className='panel-button-container'>
          <a className='button is-large' onClick={this.handleAddClick.bind(this)}>
            <i className='fa fa-fw fa-plus'></i>
            Add List
          </a>
        </div>
      </div>
    );
  }
}
