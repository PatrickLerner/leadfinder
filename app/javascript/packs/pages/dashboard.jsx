import React, { Component } from 'react';

export default class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1 className='page-title'>
          Lead Finder
        </h1>
        <div className='alert-box is-accent'>
          This project is in a closed developmental stage. If you somehow are here without knowing this, then you probably should not be here.
          <h1 style={{ textAlign: 'center', fontSize: '4rem', lineHeight: '6rem' }}>😜</h1>
        </div>

        <div className='panel panel-dashboard'>
          <h1 className='panel-header-title'>Install 'Lead Finder DEV' Chrome Extension</h1>
          <p className='panel-header-subtitle'>To make adding new Leads a breeze, install the free Chrome Extension.</p>

          <p>In order to install the extension please download it using the link below. Chrome will display a warning that it will not automatically install the extension.</p>

          <div className='u-centered panel-dashboard-download-container'>
            <a className='button' href='https://leadfinder.patricklerner.com/extension/leadfinder_chrome_1.crx'>
              <i className='fa fa-fw fa-chrome'></i> Download Chrome Extension
            </a>
          </div>

          <p>To install the extension after it was downloaded, please find the file in your download folder. It should be named <code>leadfinder_chrome_X.crx</code> (<code>X</code> is a number) and it should be in your normal 'Downloads' folder.</p>

          <img src='https://leadfinder.patricklerner.com/extension/screen_1.jpg'
               className='u-item-centered u-bordered u-max-full-width' />
          <p>Then open your Chrome settings and navigate to the 'Extensions' page.</p>
          <img src='https://leadfinder.patricklerner.com/extension/screen_2.jpg'
               className='u-item-centered u-bordered u-max-full-width' />
          <p>Chrome will now ask you to install the extension. Confirm this and the extension should be ready.</p>
          <img src='https://leadfinder.patricklerner.com/extension/screen_3.jpg'
               className='u-item-centered u-bordered u-max-full-width' />

          <p>The extension has now been installed and you will be able to use the 'Find Leads' functionality completely.</p>
        </div>
      </div>
    );
  }
}
