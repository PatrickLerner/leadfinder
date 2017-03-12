import React from 'react'
import ReactDOM from 'react-dom'

import Header from './base/header.jsx'
import Layout from './base/layout.jsx'
import LayoutLoggedIn from './base/layout_logged_in.jsx'
import LayoutLoggedOut from './base/layout_logged_out.jsx'

import Dashboard from './pages/dashboard.jsx'
import List from './pages/list.jsx'
import Main from './pages/main.jsx'
import ResetPassword from './pages/reset_password.jsx'

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path='/' component={Layout}>
        <Route component={LayoutLoggedOut}>
          <IndexRoute component={Main} />
          <Route path='resetpassword/:passwordResetToken' component={ResetPassword} />
        </Route>
        <Route component={LayoutLoggedIn}>
          <Route path='dashboard' component={Dashboard} />
          <Route path='lists/:listId' component={List} />
          <Route path='lists' component={Dashboard} />
        </Route>
      </Route>
    </Router>,
    document.body.appendChild(document.createElement('section')),
  )
})
