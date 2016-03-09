import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal-actions';
import Loader from '../shared/loader-inline.jsx';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.inputEmail = { value: '' };
    this.inputPassword = { value: '' };
    _.bindAll(this, ['loginWithPassword', 'setInputEmail', 'setInputPassword']);
  }

  loginWithPassword(e) {
    const { dispatch } = this.props;
    const email = this.inputEmail.value.trim();
    const password = this.inputPassword.value.trim();

    e.preventDefault();

    if (!email || !password) {
      return Materialize.toast('Please enter your email address and a password', 5000);
    }

    this.setState({ loading: true });

    Meteor.loginWithPassword(email, password, (error) => {
      this.setState({ loading: false });
      if (error) {
        Materialize.toast(error.reason, 5000);
      } else {
        dispatch(closeModal());
        this.inputEmail.value = '';
        this.inputPassword.value = '';
      }
    });
  }

  resetPassword(e) {
    const email = this.inputEmail.value.trim();

    e.preventDefault();

    if (!email) {
      return Materialize.toast('Enter your email address', 5000);
    }

    Meteor.call('forgot-password', email, (error) => {
      if (error) return Materialize.toast(error.reason, 5000);
      Materialize.toast('You should receive an email with a link to reset your password shortly', 5000, 'success');
    });
  }

  setInputEmail(node) {
    this.inputEmail = node;
  }

  setInputPassword(node) {
    this.inputPassword = node;
  }

  render() {
    return (
      <form onSubmit={ this.loginWithPassword }>
        <div className="modal-content">
          <h4>Log In</h4>

          <div className="input-field">
            <input id="email" name="email" type="email" maxLength="100" ref={ this.setInputEmail } />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-field">
            <input id="password" name="password" type="password" maxLength="100" ref={ this.setInputPassword } />
            <label htmlFor="password">Password</label>
          </div>
          <p className="center-align">
            <a href="#" onClick={ this.resetPassword }>Forgot password</a>
          </p>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn waves-effect waves-light">Login</button>
          <Loader noMargin hidden={ !this.state.loading } />
          <button type="button" onClick={ this.props.loginTwitch } className="btn btn-twitch waves-effect waves-light" id="twitchLoginButton">Twitch</button>
          <button type="button" onClick={ this.props.loginGoogle } className="btn btn-google waves-effect waves-light">Google
          </button>
          <button type="button" onClick={ this.props.loginFacebook } className="btn btn-facebook waves-effect waves-light">
            Facebook
          </button>
        </div>
      </form>
    );
  }
}

LoginModal.propTypes = {
  dispatch: React.PropTypes.func,
  loginFacebook: React.PropTypes.func,
  loginGoogle: React.PropTypes.func,
  loginTwitch: React.PropTypes.func
};

export default connect()(LoginModal);
