import React, { Component } from 'react';
import SignUpForm from './TeamSignUp.js';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <header className="row">
          <h1>Sign Up</h1>
          <p className="subtitle">Our service is fun and awesome, but you must be 13 years old to join</p>
          <hr />
        </header>      
        <div className="row">
          <SignUpForm />
        </div>
      </div>
    );
  }
}

export default App;
