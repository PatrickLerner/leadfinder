import React, { Component } from 'react';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';

import translate from '../../helpers/translate.js';
import EntryDeleteLink from './entry-delete-link.jsx'
import EntryListLink from './entry-list-link.jsx'

class Entry extends Component {
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
    const failure_states = [
      'searching_company', 'company_found', 'searching_email'
    ];
    let email = null;
    if (this.state.lookup_state === 'email_found') {
      email = (
        <span>
          <i className='fa fa-fw fa-envelope'></i>
          {this.state.email || (<i className='lookup-unknown'>{this.props.translate('Unknown')}</i>)}
        </span>
      )
    } else if (failure_states.indexOf(this.state.lookup_state) !== -1) {
      email = (
        <span>
          <i className='fa fa-fw fa-spin fa-circle-o-notch'></i> {this.props.translate('Processing')}...
        </span>
      )
    } else if (this.state.lookup_state === 'unknown') {
      email = (<span><i className='fa fa-fw fa-spin fa-question'></i> {this.props.translate('Unknown')}</span>)
    } else {
      email = (<span><i className='fa fa-fw fa-times'></i> {this.props.translate('Failure')}</span>)
    }

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
              {this.state.position || (<i className='lookup-unknown'>{this.props.translate('Unknown')}</i>)}
            </span><br />
            <span className='lookup-listing-company'>
              <i className='fa fa-fw fa-building'></i>
              {this.state.company}
            </span>
          </div>
          <div className='col-12 col-sm-6'>
            <span className='lookup-listing-email'>
              {email}
            </span>
          </div>
          <div className='col-12 lookup-buttons'>
            <EntryListLink entryId={this.state.id} />
            <EntryDeleteLink entryId={this.state.id} />
          </div>
        </div>
      </div>
    );
  }
}

export default translate('Entry')(Entry);
