import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Main extends Component {
  render() {
    return (
      <div>
        <h1>Hello World!</h1>
        <Link to='/dashboard'>Home</Link>
      </div>
    );
  }
}
