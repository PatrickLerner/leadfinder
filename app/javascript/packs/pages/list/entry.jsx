import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';

import translate from '../../helpers/translate.js';
import EntryEditLink from './entry-edit-link.jsx'
import EntryDeleteLink from './entry-delete-link.jsx'
import EntryListLink from './entry-list-link.jsx'

const entrySource = {
  beginDrag(props) {
    return {
      entry: props.entry
    };
  }
};

const propTypes = {
  entry: PropTypes.object.isRequired,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

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
    return gravatar.url(email, { s: 128, d: encodeURI('https://i.imgur.com/miGjkZS.png') });
  }

  render() {
    const progress_states = [
      'searching_company', 'company_found', 'searching_email'
    ];
    let email = null;
    if (this.state.email !== null && this.state.email !== '') {
      const tooltip = `${this.props.translate('Confidence')}: ${this.state.email_confidence}%`;
      let mailLink = `mailto:${this.state.email}`;
      email = (
        <a className='lookup-listing-email-link' href={mailLink} data-tooltip={tooltip}>
          <i className='fa fa-fw fa-envelope'></i>
          {this.state.email}
        </a>
      )
    } else if (progress_states.indexOf(this.state.lookup_state) !== -1) {
      email = (
        <span>
          <i className='fa fa-fw fa-spin fa-circle-o-notch'></i> {this.props.translate('Processing')}...
        </span>
      )
    } else if (this.state.lookup_state === 'unknown') {
      email = (<span><i className='fa fa-fw fa-spin fa-question'></i> {this.props.translate('Unknown')}</span>)
    } else {
      const domain = this.state.domain ? `(${this.state.domain})` : null;
      email = (
        <span>
          <i className='fa fa-fw fa-times'></i> {this.props.translate('Failure')} {domain}
        </span>
      )
    }

    const { isDragging, connectDragSource } = this.props;
    const lookupStyle = { opacity: isDragging ? 0.5 : 1 };

    const name = [
      this.state.title,
      this.state.first_name,
      this.state.middle_name,
      this.state.last_name
    ].filter(p => p !== null && p.length > 0).join(' ');

    const profiles = this.state.urls.map(url => {
      let icon = 'globe';
      let name = this.props.translate('Website');
      if (url.match(/xing.com/) !== null) {
        icon = 'xing';
        name = 'XING';
      }
      if (url.match(/linkedin.com/) !== null) {
        icon = 'linkedin';
        name = 'LinkedIn';
      }
      if (url.match(/github.com/) !== null) {
        icon = 'github';
        name = 'GitHub';
      }
      const iconClass = `fa fa-fw fa-${icon}`;
      return (
        <a href={url} className='lookup-listing-profile-link' key={url} target='_blank'>
          <i className={iconClass}></i>{name}
        </a>
      );
    });

    return connectDragSource(
      <div className='lookup-listing' style={lookupStyle}>
        <div className='row'>
          <div className='col-12 col-lg-3'>
            <img src={this.state.pictureUrl} className='lookup-picture' alt={this.props.translate('The profile image of the lead')} />
          </div>
          <div className='col-9 lookup-info-container'>
            <strong className='lookup-listing-name'>
              {name}
            </strong>
            <span className='lookup-listing-position'>
              <i className='fa fa-fw fa-briefcase'></i>
              {this.state.position || (<i className='lookup-unknown'>{this.props.translate('Unknown')}</i>)}
            </span><br />
            <span className='lookup-listing-company'>
              <i className='fa fa-fw fa-building'></i>
              {this.state.company}
            </span>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <span className='lookup-listing-email'>
              {email}
            </span>
            <span className='lookup-listing-profile-links'>
              {profiles}
            </span>
          </div>
        </div>
        <div className='lookup-buttons'>
          <EntryEditLink entryId={this.state.id} />
          <EntryListLink entryId={this.state.id} />
          <EntryDeleteLink entryId={this.state.id} />
        </div>
      </div>
    );
  }
}

Entry.propTypes = propTypes;

export default translate('Entry')(DragSource('entry', entrySource, collect)(Entry));
