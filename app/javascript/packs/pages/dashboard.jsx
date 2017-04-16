import React, { Component } from 'react';
import StepsInfo from '../components/steps_info.jsx'
import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';
import Entry from './list/entry.jsx';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestEntries: []
    };
  }

  componentWillMount() {
    apiFetch(`/api/v1/entries/latest`, {
      'method': 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, { latestEntries: data.entries }));
    });
  }

  render() {
    const latestEntries = this.state.latestEntries.map(entry => {
      return (<Entry entry={entry} key={entry.id} />);
    });

    return (
      <div>
        <h1 className='page-title'>
          Whistle
        </h1>

        <StepsInfo />

        <div className='panel panel-dashboard-banner is-large'>
          <div className='row'>
            <div className='col-12 col-lg-8'>
              <h1 className='panel-header-title'>
                {this.props.translate("Install 'Whistle' Chrome Extension")}
              </h1>
              <p className='panel-header-subtitle'>
                {this.props.translate('To make adding new leads a breeze, install the free Chrome Extension.')}
              </p>
            </div>
            <div className='col-12 col-lg-4'>
              <a className='button is-full-width' target='_blank'
                 href='https://chrome.google.com/webstore/detail/lead-finder/ebahffgopncfllemdjniblnjlbeikfdg'>
                <i className='fa fa-fw fa-chrome'></i> {this.props.translate('Download Chrome Extension')}
              </a>
            </div>
          </div>
        </div>

        <h2 className='page-subtitle'>{this.props.translate('Latest leads')}</h2>

        <div className='lookup lookup-dashboard-latest'>
          {latestEntries}
        </div>
      </div>
    );
  }
}

export default translate('Dashboard')(Dashboard);
