import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { apiFetch } from '../helpers/api_fetch.js';
import SignIn from '../components/sign_in.jsx';
import SignUp from '../components/sign_up.jsx';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: SignIn
    }
  }

  showSignIn() {
    this.setState({
      tab: SignIn
    });
  }

  showSignUp() {
    this.setState({
      tab: SignUp
    });
  }

  render() {
    let tab = null;

    if (this.state.tab === SignIn) {
      return (<SignUp switchTab={this.showSignUp.bind(this)} />);
    } else {
      return (<SignIn switchTab={this.showSignIn.bind(this)} />);
    }
  }
}
