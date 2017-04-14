import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom'

import Header from './base/header.jsx'
import Layout from './base/layout.jsx'
import LayoutLoggedIn from './base/layout_logged_in.jsx'
import LayoutLoggedOut from './base/layout_logged_out.jsx'

import Dashboard from './pages/dashboard.jsx'
import List from './pages/list.jsx'
import Find from './pages/find.jsx'
import Settings from './pages/settings.jsx'
import Help from './pages/help.jsx'
import Main from './pages/main.jsx'
import ResetPassword from './pages/reset_password.jsx'
import ConfirmMail from './pages/confirm_mail.jsx'

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.routes = {
      path: '/',
      component: Layout,
      childRoutes: [
        {
          component: LayoutLoggedOut,
          indexRoute: {
            component: Main
          },
          childRoutes: [
            { path: 'resetpassword/:passwordResetToken', component: ResetPassword },
            { path: 'confirm/:confirmationToken', component: ConfirmMail },
            { path: 'confirm/email/:email', component: ConfirmMail }
          ]
        },
        {
          component: LayoutLoggedIn,
          childRoutes: [
            { path: 'dashboard', component: Dashboard },
            { path: 'find', component: Find },
            { path: 'help', component: Help },
            { path: 'settings', component: Settings },
            { path: 'lists/:listId', component: List },
            { path: 'lists', component: List }
          ]
        }
      ]
    };
    this.state = {
      currentLanguage: 'en'
    };
  }

  getChildContext() {
    return {
      currentLanguage: this.state.currentLanguage,
      setLanguage: this.setLanguage.bind(this)
    };
  }

  setLanguage(language) {
    this.setState(Object.assign({}, this.state, {
      currentLanguage: language
    }));
  }

  render() {
    return (
      <Router history={browserHistory} routes={this.routes} />
    );
  }
}

App.childContextTypes = {
  currentLanguage: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired
};
