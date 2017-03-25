import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { Link } from 'react-router';

import Header from './header.jsx'

class Layout extends Component {
  render() {
    const { children } = this.props;

    return (
      <div className='App'>
        <Header />
        {children}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Layout);
