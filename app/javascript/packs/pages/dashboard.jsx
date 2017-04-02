import React, { Component } from 'react';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          Lead Finder
        </h1>

        <div className='panel panel-dashboard-banner is-large'>
          <div className='row'>
            <div className='col-12 col-lg-8'>
              <h1 className='panel-header-title'>Install 'Lead Finder' Chrome Extension</h1>
              <p className='panel-header-subtitle'>
                To make adding new leads a breeze, install the free Chrome Extension.
              </p>
            </div>
            <div className='col-12 col-lg-4'>
              <a className='button' href='https://leadfinder.patricklerner.com/extension/leadfinder_chrome_3.crx'>
                <i className='fa fa-fw fa-chrome'></i> Download Chrome Extension
              </a>
            </div>
          </div>
        </div>

        <div className='panel is-large'>
          <h1 className='panel-header-title'>Note about Extension</h1>
          <p>The in-development version of the extension must be installed manually by downloading it and then dragging the file onto the 'Extensions' page of your Chrome settings.</p>
        </div>
      </div>
    );
  }
}
