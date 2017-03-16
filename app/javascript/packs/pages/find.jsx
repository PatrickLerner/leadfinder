import React, { Component } from 'react';

export default class Find extends Component {
  constructor(props) {
    super(props);
    this.roles = {
      'Owner': '("Owner" OR "Founder" OR "CEO" OR "Chief Executive Officer" OR "Founder & CEO" OR "Partner")',
      'Marketing Manager': '("Marketing Manager" OR "Director of Marketing" OR "CMO" OR "Chief Marketing Officer" OR "Vice President of Marketing" OR "VP of Marketing" OR "VP Marketing")',
      'Sales Manager': '("Sales Manager" OR "Business Development Manager" OR "Sales Director" OR "Director of Sales" OR "Head of Sales" OR "VP Sales" OR "VP of Sales")',
      'Operations Manager': '("Operations Manager" OR "COO" OR "Chief Operations Officer" OR "Director of Operations" OR "VP Operations" OR "Vice President of Operations")',
      'Financial Manager': '("Financial Manager" OR "Chief Financial Officer" OR "CFO" OR "Finance Director" OR "Director of Finance" OR "VP Finance" OR "VP of Finance" "Finance Manager" OR "VP Finance")',
      'IT Manager': '("IT Manager" OR "CIO" OR "Director of IT" OR "Chief Information Officer" OR "Director of Information Technology" OR "Vice President of IT" OR "IT Director")',
      'Chief Technology Manager': '("Chief Technology Officer" OR "CTO" OR "Director of Technology" OR "VP Technology" OR "Vice President of Technology" OR "Technology Director")',
      'Customer Service Manager': '("Customer Service Manager" OR "Customer Support Manager" OR "Customer Success Manager" OR "Office Manager" OR "Head of Customer Support" OR "Customer Service Director")',
      'Sales Representative': '("Sales Representative" OR "Sales Rep" OR "Account Manager" OR "Account Executive" OR "Business Development" OR "Sales Development" OR "Sales Executive" OR "SDR" OR "BDR")',
      'HR Manager': '("Manager" OR "Officer" OR "Coordinator" OR "Director" OR "VP" OR "President") AND ("HR" OR "Human Resources" OR "People Officer" OR "Talent")',
      'Product/Project Manager': '("Product Manager" OR "Project Manager" OR "VP Product" OR "Project Lead")',
      'Lawyer': '("Lawyer" OR "Attorney" OR "Attorney at Law")',
      'Realtor': '("Realtor" OR "Real Estate Agent")'
    };
    this.excludes = [
      'assistant', 'intern', 'secretary', 'vice', 'paralegal'
    ];
    this.state = {
      role: this.roles[Object.keys(this.roles)[0]],
      excludes: this.excludes,
      region: 'Heidelberg'
    }
  }

  searchButton() {
    const query = this.state.role;
    const site = 'site:xing.com/profile';
    const region = this.state.region;
    const param = encodeURIComponent(`${query} ${region} ${site}`);
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
      const query = this.roles[name];
      return (
        <option value={query} key={name}>{name}</option>
      );
    });
    return (
      <div className='panel panel-narrow'>
        <h1 className='page-title'>
          Find Leads
        </h1>
        <div className='form-control'>
          <label>Role / Function</label>
          <select onChange={this.roleSelected.bind(this)} className='is-large'>
            {roles}
          </select>
        </div>
        <div className='form-control'>
          <label>Region</label>
          <input className='is-large' type='text' name='region'
                   value={this.state.region} onChange={this.handleInputChange.bind(this)}
                   placeholder='Region'/>
        </div>

        <a className='button is-large is-full-width' onClick={this.searchButton.bind(this)}>
          <i className='fa fa-search fa-fw'></i>
          Search
        </a>
      </div>
    );
  }
}
