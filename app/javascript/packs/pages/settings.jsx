import React, { Component } from 'react';
import PropTypes from 'prop-types';

import translate from '../helpers/translate.js';
import { apiFetch } from '../helpers/api_fetch.js';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      loaded: false,
      user: {
        language: 'en',
        first_name: '',
        last_name: '',
        email: ''
      }
    };
    this.languages = ['en', 'de'];
  }

  componentWillMount() {
    apiFetch('/api/v1/users', {
      method: 'GET'
    }).then(res => res.json()).then(data => {
      this.setState(Object.assign({}, this.state, { user: data.user, loaded: true }));
    });
  }

  handleInputChange(ev) {
    let nextState = Object.assign({}, this.state);
    nextState.user[ev.target.name] = ev.target.value;
    this.setState(nextState);
  }

  selectLanguage(language) {
    let nextState = Object.assign({}, this.state);
    nextState.user.language = language;
    this.setState(nextState);
  }

  handleSubmitClick(ev) {
    ev.preventDefault();

    const data = { user: this.state.user };

    apiFetch('/api/v1/users', {
      method: 'PATCH',
      body: JSON.stringify(data)
    }).then(res => res.json()).then(data => {
      if (data.errors === undefined) {
        this.context.setLanguage(data.user.language);
      }
      this.setState(Object.assign({}, this.state, {
        success: data.errors === undefined
      }));
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    const languages = this.languages.map(language => {
      const classes = ['flag', `flag-${language}`];
      classes.push(this.state.user.language === language ? 'flag-active' : 'flag-inactive');
      return (
        <div className={classes.join(' ')} key={language}
             onClick={this.selectLanguage.bind(this, language)}>
        </div>
      );
    });

    let success = null;
    if (this.state.success === true) {
      success = (
        <div className='alert-box is-accent'>
          <i className='fa fa-fw fa-check'></i>
          {this.props.translate('Successfully saved.')}
        </div>
      );
    } else if (this.state.success === false) {
      success = (
        <div className='alert-box is-delete'>
          <i className='fa fa-fw fa-times'></i>
          {this.props.translate('Could not save settings.')}
        </div>
      );
    }

    return (
      <div>
        <h1 className='page-title'>
          {this.props.translate('Settings')}
        </h1>

        {success}

        <div className='panel'>
          <form onSubmit={this.handleSubmitClick.bind(this)}>
            <div className='row'>
              <div className='col-12 col-lg-6'>
                <div className='form-control'>
                  <label>{this.props.translate('user', 'First Name')}</label>
                  <input className='is-large' type='text' name='first_name' autoFocus
                         value={this.state.user.first_name} onChange={this.handleInputChange.bind(this)}
                         placeholder='Peter' />
                </div>
              </div>
              <div className='col-12 col-lg-6'>
                <div className='form-control'>
                  <label>{this.props.translate('user', 'Last Name')}</label>
                  <input className='is-large' type='text' name='last_name'
                         value={this.state.user.last_name} onChange={this.handleInputChange.bind(this)}
                         placeholder='Miller' />
                </div>
              </div>
            </div>
            <div className='form-control'>
              <label>{this.props.translate('user', 'E-Mail')}</label>
              <input className='is-large' type='email' name='email' disabled
                     value={this.state.user.email} onChange={this.handleInputChange.bind(this)}
                     placeholder='peter.miller@example.com' />
            </div>
            <div className='form-control'>
              <label>{this.props.translate('Language')}</label>
              <div>
                {languages}
              </div>
            </div>
            <div className='panel-button-container'>
              <button className='button is-large is-full-width' type='submit'>
                <i className='fa fa-fw fa-save'></i>
                {this.props.translate('Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

Settings.contextTypes = {
  currentLanguage: PropTypes.string,
  setLanguage: PropTypes.func
};

export default translate('Settings')(Settings);
