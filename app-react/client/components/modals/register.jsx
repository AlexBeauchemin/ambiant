import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal-actions';

class RegisterModal extends React.Component {
  constructor(props) {
    super(props);

    this.inputEmail = null;
    this.inputName = null;
    this.inputPassword = null;
    _.bindAll(this, ['register', 'setInputEmail', 'setInputName', 'setInputPassword']);
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
      <form onSubmit={ this.register }>
        <div className="modal-content">
          <h4>Create account</h4>
          <div className="input-field">
            <input id="email" name="email" type="email" maxLength="100" ref={ this.setInputEmail } />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input id="name" name="name" type="text" maxLength="50" ref={ this.setInputName } />
            <label htmlFor="name">Name</label>
          </div>
          <div className="input-field">
            <input id="password" name="password" type="password" maxLength="100" ref={ this.setInputPassword } />
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn waves-effect waves-light">Register</button>
          <button type="button" onClick={ this.props.loginTwitch } className="btn btn-twitch waves-effect waves-light" id="twitchLoginButton">Twitch</button>
          <button type="button" onClick={ this.props.loginGoogle } className="btn btn-google waves-effect waves-light">Google</button>
          <button type="button" onClick={ this.props.loginFacebook } className="btn btn-facebook waves-effect waves-light">Facebook</button>
        </div>
      </form>
    );
  }
}

RegisterModal.propTypes = {
  dispatch: React.PropTypes.func,
  loginFacebook: React.PropTypes.func,
  loginGoogle: React.PropTypes.func,
  loginTwitch: React.PropTypes.func
};

export default connect()(RegisterModal);
