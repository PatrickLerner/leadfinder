import React from 'react'
import ReactDOM from 'react-dom'

import App from './app.jsx'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('section')),
  )
})
