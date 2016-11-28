import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import SignUpForm, { EmailInput, RequiredInput, BirthdayInput, PasswordConfirmationInput } from './TeamSignUp.js';

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
// });
describe('behavior of password confirmation field', () => {
  it('should have valid state if original password is empty', () => {
    var wrapper = shallow(<PasswordConfirmationInput password='' />);

    expect(wrapper.is('.invalid')).toBeFalsy();
    expect(wrapper.find('.error-mismatched').length).toEqual(0);
  });

  it('should have invalid state on passwords mismatch', () => {
    var validateSpy = sinon.spy(PasswordConfirmationInput.prototype, 'validate');
    var callBackSpy = sinon.spy();
    var wrapper = shallow(<PasswordConfirmationInput password='123456' updateParent={callBackSpy} />);

    // simulate inputing a password that does not match the original one
    wrapper.find('input').simulate('change', { target: { value: "123" } });

    expect(validateSpy.getCall(1).args[0]).toEqual('123');
    expect(callBackSpy.getCall(0).args[0]).toEqual({ 'passwordConf': { value: '123', valid: false } });

    expect(wrapper.is('.invalid')).toBeTruthy();
    expect(wrapper.find('.error-mismatched').length).toEqual(1);
  });

  it('should not show error when passwords match', () => {
    var wrapper = shallow(<PasswordConfirmationInput password='123456' value='123456' />);

    expect(wrapper.is('.invalid')).toBeFalsy();
    expect(wrapper.find('.error-mismatched').length).toEqual(0);
  });

});

describe('functionality of <RequiredInput />', () => {
  it('should have invalid state on start', () => {
    var wrapper = shallow(<RequiredInput value='' />);

    expect(wrapper.is('.invalid')).toBeTruthy();
    expect(wrapper.find('.error-missing').length).toEqual(1);
  });

  it('should not have invalid state on non-empty input', () => {
    var wrapper = shallow(<RequiredInput value='a' />);

    expect(wrapper.is('.invalid')).toBeFalsy();
  });

  it('should update name field on input change', () => {
    var handleChangeSpy = sinon.spy();
    var wrapper = shallow(<RequiredInput field='name' updateParent={handleChangeSpy} />);
    wrapper.find('input').simulate('change', { target: { value: "a" } });

    expect(handleChangeSpy.getCall(0).args[0]).toEqual({ name: { value: 'a', valid: true } });
    expect(handleChangeSpy.called).toBeTruthy();
    expect(wrapper.is('.invalid')).toBeFalsy();
    expect(wrapper.find('.error-missing').length).toEqual(0);
  });

  it('should update password field on input change', () => {
    var handleChangeSpy = sinon.spy();
    var wrapper = shallow(<RequiredInput field='password' updateParent={handleChangeSpy} />);
    wrapper.find('input').simulate('change', { target: { value: "a" } });

    expect(handleChangeSpy.getCall(0).args[0]).toEqual({ password: { value: 'a', valid: true } });
    expect(handleChangeSpy.called).toBeTruthy();
    expect(wrapper.is('.invalid')).toBeFalsy();
    expect(wrapper.find('.error-missing').length).toEqual(0);
  });
});

describe('behavior of email input', () =>{
  it('should show error message when input is not valid', () => {
    //var wrapper = shallow(<EmailInput value='aa'/>);
    var wrapper = shallow(<EmailInput value="a@uw.edu"/>)
    expect(wrapper.is('.invalid')).toBeFalsy();
  });

  it('should show error message in the dom when input is not valid', () => {
    var validateSpy = sinon.spy(EmailInput.prototype, 'validate');
    var dummySpy = sinon.spy();

    var wrapper = shallow(<EmailInput value="aaa" updateParent={dummySpy}/>);

    expect(wrapper.is('.invalid')).toBeTruthy();
    expect(wrapper.find('.error-invalid')).toBeTruthy();

    wrapper.find('input').simulate('change', {target: {value: "bbb"}});

    expect(wrapper.is('.invalid')).toBeTruthy();
    expect(wrapper.find('.error-invalid')).toBeTruthy();
    expect(validateSpy.getCall(1).args[0]).toEqual('bbb');
    expect(dummySpy.getCall(0).args[0]).toEqual({'email': {value: 'bbb',valid: false}});
  });
});

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
    wrapper.find('EmailInput input').simulate('change', { target: { value: "a@gmail.com" } });
    wrapper.find('#name input').simulate('change', { target: { value: "name" } });
    wrapper.find('BirthdayInput input').simulate('change', { target: { value: "03/25/1994" } });
    wrapper.find('#password input').simulate('change', { target: { value: "123456" } });
    wrapper.find('PasswordConfirmationInput input').simulate('change', { target: { value: "123456" } });
  });

  // tear down stage
  afterEach(() => {
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

    // the submit button should be disabled
    // need to check how to test this!!!
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

    // we should have 4 div's with className
    // invalid (except the one for password confirmation) 
    // after we reset all the fields
    expect(wrapper.find('.invalid').reduce((sum, cur) => { return sum + 1 }, 0)).toEqual(4);
  });
});

describe('behavior of the birthdate field', () => {
  it('should be invalid and missing on start', () => {
    var wrapper = shallow(<BirthdayInput value='' />);
    //invalid input
    expect(wrapper.is('.invalid')).toBeTruthy();
    //input is missing
    expect(wrapper.find('.error-missing').length).toEqual(1);
  });

  it('should be invalid for input that is not a date', () => {
    var wrapper = shallow(<BirthdayInput value='not a date' />);
    //invalid input
    expect(wrapper.is('.invalid')).toBeTruthy();
    //invalid date
    expect(wrapper.find('.error-invalid').length).toEqual(1);
  });

  it('should not show error for date more than 13 years ago', () => {
    var wrapper = shallow(<BirthdayInput value='01/30/1996' />);
    //valid input
    expect(wrapper.is('.invalid')).toBeFalsy();
    //is old enough
    expect(wrapper.find('.error-not-old').length).toEqual(0);
  });

  it('should show error for date less than 13 years ago', () => {
    var wrapper = shallow(<BirthdayInput value='November 27, 2016' />);
    //invalid input
    expect(wrapper.is('.invalid')).toBeTruthy();
    //valid date
    expect(wrapper.find('.error-invalid').length).toEqual(0);
    //is not old enough
    expect(wrapper.find('.error-not-old').length).toEqual(1);
  });

  it('should execute updateParent callback on input change', () => {
    var handleChangeSpy = sinon.spy();
    var wrapper = shallow(<BirthdayInput updateParent={handleChangeSpy} />);
    wrapper.find('input').simulate('change', { target: { value: "January 30, 1996" } });
    //callback is called
    expect(handleChangeSpy.called).toBeTruthy();
    expect(handleChangeSpy.getCall(0).args[0]).toEqual({ dob: { value: 'January 30, 1996', valid: true } });
  });

});

describe('behavior of the form submit button', () => {

});
