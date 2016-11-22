import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {shallow, mount} from 'enzyme';
import sinon from 'sinon';
import SignUpForm, {EmailInput, RequiredInput, BirthdayInput, PasswordConfirmationInput} from './TeamSignUp.js';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
// });

describe('behavior of the form reset button', () => {
  let wrapper;
  let handleResetSpy;

  beforeAll(() => {
    //create a spy on the handleReset() method so that we can verify later it has been called
    handleResetSpy = sinon.spy(SignUpForm.prototype, 'handleReset');
  });

  // set up stage
  beforeEach(() => {
    wrapper = mount(<SignUpForm />);
    // input some dummy but valid data into each field
    wrapper.find('EmailInput input').simulate('change', {target: {value: "a@gmail.com"}});
    wrapper.find('#name input').simulate('change', {target: {value: "name"}});
    wrapper.find('BirthdayInput input').simulate('change', {target: {value: "03/25/1994"}});
    wrapper.find('#password input').simulate('change', {target: {value: "123456"}});
    wrapper.find('PasswordConfirmationInput input').simulate('change', {target: {value: "123456"}});
  });

  // tear down stage
  afterEach(() =>{
    wrapper = undefined;
    // reset the spy state
    handleResetSpy.reset(); 
  });

  it('should set all the input fields inside the state of SignUpForm to default values', () => {
    // call the reset method
    wrapper.find('#resetButton').simulate('click', {});

    // assert that the handleReset() has been called
    expect(handleResetSpy.callCount).toEqual(1);

    // now assert each item inside the state is its default value
    expect(wrapper.state(['email']).value).toEqual('');
    expect(wrapper.state(['email']).valid).toBeFalsy();

    expect(wrapper.state(['name']).value).toEqual('');
    expect(wrapper.state(['name']).valid).toBeFalsy();

    expect(wrapper.state(['dob']).value).toEqual('');
    expect(wrapper.state(['dob']).valid).toBeFalsy();

    expect(wrapper.state(['password']).value).toEqual('');
    expect(wrapper.state(['password']).valid).toBeFalsy();

    expect(wrapper.state(['passwordConf']).value).toEqual('');
    expect(wrapper.state(['passwordConf']).valid).toBeFalsy();

  });

  it('should set email, name, birthdate, password, and confirm password fields to be empty', () => {
    // call the reset method
    wrapper.find('#resetButton').simulate('click', {});

    // assert that the handleReset() has been called
    expect(handleResetSpy.callCount).toEqual(1);

    // assert each field is empty
    expect(wrapper.find('EmailInput input').text()).toEqual('');
    expect(wrapper.find('#name input').text()).toEqual('');
    expect(wrapper.find('BirthdayInput input').text()).toEqual('');
    expect(wrapper.find('#password input').text()).toEqual('');
    expect(wrapper.find('PasswordConfirmationInput input').text()).toEqual('');

  });
});
