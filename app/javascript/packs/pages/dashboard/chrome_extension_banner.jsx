import React, { Component } from 'react';
import translate from '../../helpers/translate.js';

class ChromeExtensionBanner extends Component {
  render() {
    return (
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
    );
  }
}

export default translate('ChromeExtensionBanner')(ChromeExtensionBanner);
