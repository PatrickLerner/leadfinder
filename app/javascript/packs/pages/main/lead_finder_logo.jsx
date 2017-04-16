import React, { Component } from 'react';

export default class LeadFinderLogo extends Component {
  render() {
    const tagLine = "Europe's #1 Recruiting Tool";
    return (
      <div className='row'>
        <div className='col-12 col-lg-5'>
          <div className='lead-logo-md'></div>
        </div>
        <div className='col-12 col-lg-7'>
          <div className='lead-title-md'>whistle.io</div>
        </div>
      </div>
    );
  }
}
