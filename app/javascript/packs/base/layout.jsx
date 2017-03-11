import React, { Component } from 'react';
import { Link } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

import Header from './header.jsx'

export default class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className='App'>
        <Header />
        { children }
      </div>
    );
  }
}
