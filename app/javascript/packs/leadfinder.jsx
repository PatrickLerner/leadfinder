import React from 'react'
import ReactDOM from 'react-dom'

import Header from './base/header.jsx'
import Layout from './base/layout.jsx'

import Main from './pages/main.jsx'
import Dashboard from './pages/dashboard.jsx'
import Lists from './pages/lists.jsx'

import { Router, Route, IndexRoute, browserHistory } from 'react-router';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Router history={ browserHistory }>
      <Route path='/' component={ Layout }>
        <IndexRoute component={ Main } />
        <Route path='dashboard' component={ Dashboard } />
        <Route path='lists' component={ Lists } />
      </Route>
    </Router>,
    document.body.appendChild(document.createElement('section')),
  )
})
