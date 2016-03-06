import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../../actions/modal-actions';
import configs from '../../../lib/configs';

function socialLoginWrapper(Component) {
  class SocialLogin extends React.Component {
    constructor(props) {
      super(props);

      _.bindAll(this, ['loginFacebook', 'loginGoogle', 'loginTwitch']);
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

    render() {
      return (
        <Component
          loginFacebook={ this.loginFacebook }
          loginGoogle={ this.loginGoogle }
          loginTwitch={ this.loginTwitch }
          { ...this.props }
        />
      );
    }
  }

  SocialLogin.propTypes = {
    dispatch: React.PropTypes.func
  };

  return connect()(SocialLogin);
}

export default socialLoginWrapper;
