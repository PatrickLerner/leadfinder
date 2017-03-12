import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';

import EntryListLink from './entry-list-link.jsx'

export default class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.entry, {
      pictureUrl: this.pictureUrl(props.entry.email)
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign({}, this.state, nextProps.entry, {
      pictureUrl: this.pictureUrl(nextProps.entry.email)
    }));
  }

  pictureUrl(email) {
    return gravatar.url(email, { s: 128, d: encodeURI('http://i.imgur.com/miGjkZS.png') });
  }

  render() {
    return (
      <div className='lookup-listing'>
        <img src={this.state.pictureUrl} className='lookup-picture' />
        <div className='row'>
          <div className='col-12'>
            <strong className='lookup-listing-name'>
              {this.state.first_name} {this.state.last_name}
            </strong>
          </div>
          <div className='col-12 col-sm-6'>
            <span className='lookup-listing-position'>
              <i className='fa fa-fw fa-briefcase'></i>
              {this.state.position || (<i className='lookup-unknown'>Unknown</i>)}
            </span><br />
            <span className='lookup-listing-company'>
              <i className='fa fa-fw fa-building'></i>
              {this.state.company}
            </span>
          </div>
          <div className='col-12 col-sm-6'>
            <span className='lookup-listing-email'>
              <i className='fa fa-fw fa-envelope'></i>
              {this.state.email || (<i className='lookup-unknown'>Unknown</i>)}
            </span>
          </div>
          <div className='col-12 lookup-buttons'>
            <EntryListLink entryId={this.state.id} />
            <Link to='/' className='button is-small is-light'>
              <i className='fa fa-times'></i>
              Delete
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
