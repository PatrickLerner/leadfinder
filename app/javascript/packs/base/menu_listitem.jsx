import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';
import { Link } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';

class MenuListItem extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div>
        <Link className="page-menu-subitem" to={`/lists/` + this.state.id}>
          <i className='fa fa-fw fa-list'></i>
          {this.state.name}
        </Link>
      </div>
    );
  }
}

const types = ['entry'];
const spec = {
  drop(props, monitor, component) {
    const item = monitor.getItem();

    const data = {
      entry: {
        lists: [props.id]
      }
    };

    apiFetch(`/api/v1/entries/${item.entry.id}/lists`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
};

const collect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

export default DropTarget(types, spec, collect)(MenuListItem);
