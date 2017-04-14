import React, { Component } from 'react';

export default class StepsInfo extends Component {
  render() {
    return (
      <div className='row u-centered steps-info'>
        <div className='col-lg-3 col-12'>
          <div className='lead-icon-idea-sm'></div>
          <h1 className='steps-info-title'>Your Product</h1>
        </div>
        <div className='col-lg-3 col-12'>
          <div className='lead-icon-network-sm'></div>
          <h1 className='steps-info-title'>Lead Generation</h1>
        </div>
        <div className='col-lg-3 col-12'>
          <div className='lead-icon-list-sm'></div>
          <h1 className='steps-info-title'>Lead Lists</h1>
        </div>
        <div className='col-lg-3 col-12'>
          <div className='lead-icon-sales-sm'></div>
          <h1 className='steps-info-title'>Increased Performance</h1>
        </div>
      </div>
    );
  }
}
