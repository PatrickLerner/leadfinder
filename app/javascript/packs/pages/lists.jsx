import React, { Component } from 'react';
import uuidV4 from 'uuid/v4';
import gravatar from 'gravatar';

class Lead {
  constructor(options) {
    ['first_name', 'last_name', 'position', 'company', 'email'].forEach(key => {
      this[key] = options[key];
    });
    this.uuid = uuidV4();
  }

  pictureUrl() {
    if (this.email !== undefined) {
      return gravatar.url(this.email, { s: 128 });
    } else {
      return null;
    }
  }
}

export default class Lists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leads: [
        new Lead({
          first_name: 'Patrick',
          last_name: 'Lerner',
          position: 'Ruby on Rails Webentwickler',
          company: 'Launchwerk GmbH',
          email: 'ptlerner@gmail.com'
        }),
        new Lead({
          first_name: 'Daniel',
          last_name: 'Schäfer',
          position: 'Geschäftsführer',
          company: 'Instaffo GmbH',
          email: 'd.schaefer@instaffo.de'
        }),
      ]
    }
  }

  render() {
    const leads = this.state.leads.map(lead => {
      return (
        <div className='lookup-listing' key={lead.uuid}>
          <img src={lead.pictureUrl()} className='lookup-picture' />
          <div className='row'>
            <div className='col-12'>
              <strong className='lookup-listing-name'>{lead.first_name} {lead.last_name}</strong>
            </div>
            <div className='col-12 col-sm-6'>
              <span className='lookup-listing-position'>
                <i className='fa fa-fw fa-briefcase'></i>
                {lead.position}
              </span><br />
              <span className='lookup-listing-company'>
                <i className='fa fa-fw fa-building'></i>
                {lead.company}
              </span>
            </div>
            <div className='col-12 col-sm-6'>
              <span className='lookup-listing-email'>
                <i className='fa fa-fw fa-envelope'></i>
                {lead.email}
              </span>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <h1 className='page-title'>
          Inbox
        </h1>
        <div className='lookup'>
          {leads}
        </div>
      </div>
    );
  }
}
