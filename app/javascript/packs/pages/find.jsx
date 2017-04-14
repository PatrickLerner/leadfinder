import React, { Component } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { roles } from '../support/roles.js'
import { industries } from '../support/industries.js'

import translate from '../helpers/translate.js';

class Find extends Component {
  constructor(props) {
    super(props);
    this.excludes = [
      'assistant', 'intern', 'secretary', 'vice', 'paralegal'
    ];
    this.state = {
      role: Object.keys(roles)[0],
      industry: '',
      excludes: this.excludes,
      regions: [],
      region: ''
    }
  }

  roleToString(role) {
    return '(' + role.map(subquery => {
      return subquery.map(item => `"${item}"`).join(' OR ');
    }).join(') AND (') + ')';
  }

  industryInLanguages(industry, languages) {
    const industryInLanguages = languages.map(language => industry[language]);
    const result = industryInLanguages.map(industry => `"${industry}"`).join(' OR ');
    return industryInLanguages.length > 1 ? `(${result})` : result;
  }

  languagesInRegions(regions) {
    const regionCountries = regions.map(region =>
      region.address_components[region.address_components.length - 1].long_name
    );
    const germanCountries = ['Germany', 'Austria', 'Switzerland', 'Lichtenstein'];
    let languagesRegions = regionCountries.map(region => {
      return germanCountries.indexOf(region) !== -1 ? 'de' : 'en';
    });
    const languages = languagesRegions.filter((l, i) => languagesRegions.indexOf(l) == i);
    return languages.length == 0 ? [this.props.currentLanguage] : languages;
  }

  handleSearchButton(ev) {
    ev.preventDefault();
    handleSearch('xing');
  }

  handleSearch(provider, ev) {
    if (ev) { ev.preventDefault(); }

    const query = this.roleToString(roles[this.state.role]);
    const site = provider === 'linkedin' ? 'site:linkedin.com/in' : 'site:xing.com/profile';
    const regionNames = this.state.regions.map(region => region.address_components[0].long_name);

    const regions = regionNames.length > 0 ? '(' + regionNames.map(r => `"${r}"`).join(' OR ') + ')' : ''
    const excludes = this.excludes.map(item => `-${item}`).join(' ');
    let industry = '';
    if (this.state.industry) {
      const languagesRegions = this.languagesInRegions(this.state.regions);
      industry = this.industryInLanguages(JSON.parse(this.state.industry), languagesRegions)
    }
    //const industry = this.state.industry ? `"${this.state.industry}"` : '';
    const param = encodeURIComponent(`${query} ${regions} ${excludes} ${industry} ${site}`);
    const url = `https://www.google.com/search?num=100&q=${param}`;
    window.open(url);
  }

  roleSelected(ev) {
    this.setState(Object.assign({}, this.state, {
      role: ev.target.value
    }));
  }

  industrySelected(ev) {
    this.setState(Object.assign({}, this.state, {
      industry: ev.target.value
    }));
  }

  regionSelected(region) {
    if (region.place_id === undefined) { return; }
    const existsAlready = this.state.regions.find(r => r.place_id == region.place_id);
    let newState = Object.assign({}, this.state);
    newState.region = '';
    if (!existsAlready) {
      newState.regions.push(region);
    }
    this.setState(newState);
  }

  regionDeselected(region) {
    let newState = Object.assign({}, this.state);
    newState.regions = newState.regions.filter(r => r != region)
    this.setState(newState);
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  preventEnter(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  render() {
    const role_options = Object.keys(roles).map(name => {
      return (<option value={name} key={name}>{name}</option>);
    });

    const industry_options = [<option value='{}' key='null'>{this.props.translate('All industries')}</option>];
    industries.forEach(industry => {
      industry_options.push(
        <option value={JSON.stringify(industry)} key={industry['en']}>
          {industry[this.props.currentLanguage]}
        </option>
      );
    });

    const examples = [];
    const current_role = roles[this.state.role];
    const max_subrole_length = Math.max.apply(null, current_role.map(a => a.length));
    for (let i = 0; i < max_subrole_length; i++) {
      examples.push(current_role.map(a => a[i] || a[0]).join(' '));
    }

    const regions = this.state.regions.map(region => {
      return (
        <span className='tag-label' key={region.place_id} onClick={this.regionDeselected.bind(this, region)}>
          {region.address_components[0].long_name}
          <i className='fa fa-fw fa-times'></i>
        </span>
      );
    });

    return (
      <div>
        <h1 className='page-title'>
          {this.props.translate('Find Leads')}
        </h1>
        <div className='panel panel-find'>
          <form onSubmit={this.handleSearchButton.bind(this)}>
            <div className='row'>
              <div className='col-12 col-lg-6'>
                <div className='form-control'>
                  <label>{this.props.translate('Role / Function')}</label>
                  <select onChange={this.roleSelected.bind(this)} className='is-large'>
                    {role_options}
                  </select>
                  <small className='u-single-line'>{examples.join(', ')}</small>
                </div>
              </div>
              <div className='col-12 col-lg-6'>
                <div className='form-control'>
                  <label>{this.props.translate('Industry')}</label>
                  <select onChange={this.industrySelected.bind(this)} className='is-large'>
                    {industry_options}
                  </select>
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='form-control'>
                  <label>{this.props.translate('Region')}</label>
                  <Autocomplete className='is-large' name='region' type='text' value={this.state.region}
                                placeholder={this.props.translate('Enter region here')}
                                onChange={this.handleInputChange.bind(this)}
                                onKeyPress={this.preventEnter.bind(this)}
                                onPlaceSelected={this.regionSelected.bind(this)} types={['(cities)']} />
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                {regions}
              </div>
            </div>
            <div className='row'>
              <div className='col-12 col-lg-4 col-lg-offset-2'>
                <div className='form-control'>
                  <button className='button is-large is-full-width' type='submit'
                          onClick={this.handleSearch.bind(this, 'xing')}>
                    <i className='fa fa-xing fa-fw'></i>
                    {this.props.translate('Search XING')}
                  </button>
                </div>
              </div>
              <div className='col-12 col-lg-4'>
                <div className='form-control'>
                  <button className='button is-large is-full-width' type='submit'
                          onClick={this.handleSearch.bind(this, 'linkedin')}>
                    <i className='fa fa-linkedin fa-fw'></i>
                    {this.props.translate('Search LinkedIn')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default translate('Find')(Find);
