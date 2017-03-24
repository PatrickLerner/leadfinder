import React, { Component } from 'react';

import translate from '../helpers/translate.js';

class Find extends Component {
  constructor(props) {
    super(props);
    this.roles = {
      'Owner': [['Owner', 'Founder', 'CEO', 'Chief Executive Officer', 'Founder & CEO', 'Partner']],
      'Marketing Manager': [[
        'Marketing Manager', 'Director of Marketing', 'CMO', 'Chief Marketing Officer',
        'Vice President of Marketing', 'VP of Marketing', 'VP Marketing'
      ]],
      'Sales Manager': [[
        'Sales Manager', 'Business Development Manager', 'Sales Director', 'Director of Sales', 'Head of Sales',
        'VP Sales', 'VP of Sales'
      ]],
      'Operations Manager': [[
        'Operations Manager', 'COO', 'Chief Operations Officer', 'Director of Operations', 'VP Operations',
        'Vice President of Operations'
      ]],
      'Financial Manager': [[
        'Financial Manager', 'Chief Financial Officer', 'CFO', 'Finance Director', 'Director of Finance',
        'VP Finance', 'VP of Finance', 'Finance Manager', 'VP Finance'
      ]],
      'IT Manager': [[
        'IT Manager', 'CIO', 'Director of IT', 'Chief Information Officer', 'Director of Information Technology',
        'Vice President of IT', 'IT Director'
      ]],
      'Chief Technology Manager': [[
        'Chief Technology Officer', 'CTO', 'Director of Technology', 'VP Technology', 'Vice President of Technology',
        'Technology Director'
      ]],
      'Customer Service Manager': [[
        'Customer Service Manager', 'Customer Support Manager', 'Customer Success Manager', 'Office Manager',
        'Head of Customer Support', 'Customer Service Director'
      ]],
      'Sales Representative': [[
        'Sales Representative', 'Sales Rep', 'Account Manager', 'Account Executive', 'Business Development',
        'Sales Development', 'Sales Executive', 'SDR', 'BDR'
      ]],
      'HR Manager': [
        ['Manager', 'Officer', 'Coordinator', 'Director', 'VP', 'President'],
        ['HR', 'Human Resources', 'People Officer', 'Talent']
      ],
      'Product/Project Manager': [['Product Manager', 'Project Manager', 'VP Product', 'Project Lead']],
      'Lawyer': [['Lawyer', 'Attorney', 'Attorney at Law']],
      'Realtor': [['Realtor', 'Real Estate Agent']]
    };
    this.excludes = [
      'assistant', 'intern', 'secretary', 'vice', 'paralegal'
    ];
    this.state = {
      role: Object.keys(this.roles)[0],
      excludes: this.excludes,
      region: 'Heidelberg'
    }
  }

  roleToString(role) {
    return '(' + role.map(subquery => {
      return subquery.map(item => `"${item}"`).join(' OR ');
    }).join(') AND (') + ')';
  }

  searchButton() {
    const query = this.roleToString(this.roles[this.state.role]);
    const site = 'site:xing.com/profile';
    const region = this.state.region;
    const excludes = this.excludes.map(item => `-${item}`).join(' ');
    const param = encodeURIComponent(`${query} ${region} ${excludes} ${site}`);
    const url = `https://www.google.com/search?q=${param}`;
    window.open(url);
  }

  roleSelected(ev) {
    this.setState(Object.assign({}, this.state, {
      role: ev.target.value
    }));
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  render() {
    const roles = Object.keys(this.roles).map(name => {
      return (<option value={name} key={name}>{name}</option>);
    });

    const examples = [];
    const current_role = this.roles[this.state.role];
    const max_subrole_length = Math.max.apply(null, current_role.map(a => a.length));
    for (let i = 0; i < max_subrole_length; i++) {
      examples.push(current_role.map(a => a[i] || a[0]).join(' '));
    }

    return (
      <div className='panel panel-narrow panel-find'>
        <h1 className='page-title'>
          {this.props.translate('Find Leads')}
        </h1>
        <div className='form-control'>
          <label>{this.props.translate('Role / Function')}</label>
          <select onChange={this.roleSelected.bind(this)} className='is-large'>
            {roles}
          </select>
          <small className='u-single-line'>{examples.join(', ')}</small>
        </div>
        <div className='form-control'>
          <label>{this.props.translate('Region')}</label>
          <input className='is-large' type='text' name='region'
                   value={this.state.region} onChange={this.handleInputChange.bind(this)}
                   placeholder={this.props.translate('Region')}/>
        </div>

        <a className='button is-large is-full-width' onClick={this.searchButton.bind(this)}>
          <i className='fa fa-search fa-fw'></i>
          {this.props.translate('Search')}
        </a>
      </div>
    );
  }
}

export default translate('Find')(Find);
