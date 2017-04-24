import React, { Component } from 'react';
import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';
import LatestEntries from './dashboard/latest_entries.jsx';
import ChromeExtensionBanner from './dashboard/chrome_extension_banner.jsx';
import StepsInfo from './dashboard/steps_info.jsx'

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          Whistle
        </h1>

        <StepsInfo />
        <ChromeExtensionBanner />
        <LatestEntries />
      </div>
    );
  }
}

export default translate('Dashboard')(Dashboard);
