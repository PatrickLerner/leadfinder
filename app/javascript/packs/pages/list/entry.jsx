import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import { Link } from 'react-router';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';

import translate from '../../helpers/translate.js';
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
    const failure_states = [
      'searching_company', 'company_found', 'searching_email'
    ];
    let email = null;
    if (this.state.email !== null) {
      const tooltip = `${this.props.translate('Confidence')}: ${this.state.email_confidence}%`;
      let mailLink = `mailto:${this.state.email}`;
      email = (
        <span data-tooltip={tooltip}>
          <i className='fa fa-fw fa-envelope'></i>
          <a className='lookup-listing-email-link' href={mailLink}>{this.state.email}</a>
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

    let company = this.state.company;
    if (this.state.company_cities.length > 0) {
      company += ` (${this.state.company_cities.join(', ')})`
    }

    const { isDragging, connectDragSource } = this.props;
    const lookupStyle = { opacity: isDragging ? 0.5 : 1 };

    return connectDragSource(
      <div className='lookup-listing' style={lookupStyle}>
        <img src={this.state.pictureUrl} className='lookup-picture' alt={this.props.translate('The profile image of the lead')} />
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
              {company}
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

Entry.propTypes = propTypes;

export default translate('Entry')(DragSource('entry', entrySource, collect)(Entry));
