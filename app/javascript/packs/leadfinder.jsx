import React from 'react'
import ReactDOM from 'react-dom'

import Header from './base/header.jsx'
import Layout from './base/layout.jsx'
import LayoutLoggedIn from './base/layout_logged_in.jsx'
import LayoutLoggedOut from './base/layout_logged_out.jsx'

import Main from './pages/main.jsx'
import Dashboard from './pages/dashboard.jsx'
import Lists from './pages/lists.jsx'
import List from './pages/list.jsx'
import ListNew from './pages/list_new.jsx'

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router history={browserHistory}>
      <Route path='/' component={Layout}>
        <Route component={LayoutLoggedOut}>
          <IndexRoute component={Main} />
        </Route>
        <Route component={LayoutLoggedIn}>
          <Route path='dashboard' component={Dashboard} />
          <Route path='lists/add' component={ListNew} />
          <Route path='lists/:listId' component={List} />
          <Route path='lists' component={Lists} />
        </Route>
      </Route>
    </Router>,
    document.body.appendChild(document.createElement('section')),
  )
})
