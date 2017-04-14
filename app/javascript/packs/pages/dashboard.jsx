import React, { Component } from 'react';
import StepsInfo from '../components/steps_info.jsx'
import translate from '../helpers/translate.js';

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          Lead Finder
        </h1>

        <StepsInfo />

        <div className='panel panel-dashboard-banner is-large'>
          <div className='row'>
            <div className='col-12 col-lg-8'>
              <h1 className='panel-header-title'>
                {this.props.translate("Install 'Lead Finder' Chrome Extension")}
              </h1>
              <p className='panel-header-subtitle'>
                {this.props.translate('To make adding new leads a breeze, install the free Chrome Extension.')}
              </p>
            </div>
            <div className='col-12 col-lg-4'>
              <a className='button' href='https://chrome.google.com/webstore/detail/lead-finder/ebahffgopncfllemdjniblnjlbeikfdg' target='_blank'>
                <i className='fa fa-fw fa-chrome'></i> {this.props.translate('Download Chrome Extension')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default translate('Dashboard')(Dashboard);
