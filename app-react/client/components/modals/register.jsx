import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal-actions';
import configs from '../../../lib/configs';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.inputEmail = null;
    this.inputName = null;
    this.inputPassword = null;
    _.bindAll(this, ['register', 'loginFacebook', 'loginTwitch', 'loginGoogle']);
  }

  loginFacebook() {
    const { dispatch } = this.props;

    Meteor.loginWithFacebook({}, (err) => {
      if (err) return Materialize.toast(err.message, 5000);
      dispatch(closeModal());
    });
  }

  loginGoogle() {
    const { dispatch } = this.props;

    Meteor.loginWithGoogle({}, (err) => {
      if (err) return Materialize.toast(err.message, 5000);
      dispatch(closeModal());
    });
  }

  loginTwitch() {
    const { dispatch } = this.props;

    Meteor.loginWithTwitch({ requestPermissions: configs.TWITCH_SCOPE }, (error) => {
      if (error) return Materialize.toast("Something wrong happened, can't login with Twitch", 5000);
      dispatch(closeModal());
    });
  }

  register(e) {
    const { dispatch } = this.props;

    e.preventDefault();

    dispatch(closeModal());
    this.inputEmail.value = '';
    this.inputName.value = '';
    this.inputPassword.value = '';
  }

  setInputEmail(node) {
    this.inputEmail = node;
  }

  setInputName(node) {
    this.inputName = node;
  }

  setInputPassword(node) {
    this.inputPassword = node;
  }

  render() {
    return (
      <form id="modal-register" className="modal" data-name="register">
        <div className="modal-content">
          <h4>Create account</h4>
          <div className="input-field">
            <input id="email" name="email" type="email" maxLength="100" />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input id="name" name="name" type="text" maxLength="50" />
            <label htmlFor="name">Name</label>
          </div>
          <div className="input-field">
            <input id="password" name="password" type="password" maxLength="100" />
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn waves-effect waves-light">Register</button>
          <button type="button" className="btn btn-twitch waves-effect waves-light" id="twitchLoginButton" data-action="login-twitch">Twitch</button>
          <button type="button" className="btn btn-google waves-effect waves-light" data-action="login-google">Google</button>
          <button type="button" className="btn btn-facebook waves-effect waves-light" data-action="login-facebook">Facebook</button>
        </div>
      </form>
    );
  }
}

LoginModal.propTypes = {
  dispatch: React.PropTypes.func
};

export default connect()(LoginModal);
