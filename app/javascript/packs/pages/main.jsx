import React, { Component } from 'react';
import { browserHistory } from 'react-router';

import { apiFetch } from '../helpers/api_fetch.js';
import PasswordReset from '../components/password_reset.jsx';
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

  showPasswordReset() {
    this.setState({
      tab: PasswordReset
    });
  }

  render() {
    let tab = null;

    if (this.state.tab === SignIn) {
      return (
        <SignIn resetPassword={this.showPasswordReset.bind(this)}
                switchTab={this.showSignUp.bind(this)} />
      );
    } else if (this.state.tab === SignUp) {
      return (<SignUp switchTab={this.showSignIn.bind(this)} />);
    } else {
      return (<PasswordReset switchTab={this.showSignIn.bind(this)} />);
    }
  }
}
