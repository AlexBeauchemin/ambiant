import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal-actions';
import configs from '../../../lib/configs';

const LoginModal = ({dispatch}) => {
  let inputEmail;
  let inputPassword;

  const loginWithPassword = (e) => {
    e.preventDefault();

    dispatch(closeModal());
    inputEmail.value = '';
    inputPassword.value = '';
  };

  const loginFacebook = () => {
    Meteor.loginWithFacebook({}, function(err) {
      if (err) return Materialize.toast(err.message, 5000);
      dispatch(closeModal());
    });
  };

  const loginGoogle = () => {
    Meteor.loginWithGoogle({}, function(err) {
      if (err) return Materialize.toast(err.message, 5000);
      dispatch(closeModal());
    });
  };

  const loginTwitch = () => {
    Meteor.loginWithTwitch({requestPermissions: configs.TWITCH_SCOPE}, function (error) {
      if (error) return Materialize.toast("Something wrong happened, can't login with Twitch", 5000);
      dispatch(closeModal());
    });
  };

  return (
    <form id="modal-login" className="modal login" data-name="login" onSubmit={ loginWithPassword }>
      <div className="modal-content">
        <h4>Log In</h4>
        <div className="input-field">
          <input id="email" name="email" type="email" maxLength="100" ref={node => { inputEmail = node; }} />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-field">
          <input id="password" name="password" type="password" maxLength="100" ref={node => { inputPassword = node; }} />
          <label htmlFor="password">Password</label>
        </div>
        <p className="center-align">
          <a href="#">Forgot password</a>
        </p>
      </div>
      <div className="modal-footer">
        <button type="submit" className="btn waves-effect waves-light">Login</button>
        <button type="button" onClick={ loginTwitch } className="btn btn-twitch waves-effect waves-light" id="twitchLoginButton">Twitch</button>
        <button type="button" onClick={ loginGoogle } className="btn btn-google waves-effect waves-light">Google</button>
        <button type="button" onClick={ loginFacebook } className="btn btn-facebook waves-effect waves-light">Facebook</button>
      </div>
    </form>
  );
};

export default connect()(LoginModal);