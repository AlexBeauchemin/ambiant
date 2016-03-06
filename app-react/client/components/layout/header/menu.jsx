import React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal-actions';
import _ from 'lodash';

class Menu extends React.Component {
  constructor(props) {
    super(props);

    _.bindAll(this, ['_open', '_logout']);
  }

  _open(e) {
    e.preventDefault();
    const item = e.currentTarget.dataset.target;
    this.props.dispatch(openModal(item));
  }

  _logout(e) {
    e.preventDefault();
    Meteor.logout((error) => {
      if (error) Materialize.toast(error.reason, 5000);
    });
  }

  render() {
    const { dispatch, radio, user } = this.props;
    const activeMenuItems = [];
    const isGuest = _.get(user, 'profile.guest');
    const radioUrl = radio ? `/${radio.url}` : '#';
    const name = _.get(user, 'profile.name');

    const menuItems = {
      newRadio: <li><a href="#" data-target="new-radio" onClick={this._open}>New radio</a></li>,
      myRadio: <li><a href={radioUrl}>My radio</a></li>,
      login: <li><a href="#" data-target="login" onClick={this._open}>Log In</a></li>,
      register: <li><a href="#" data-target="register" onClick={this._open}>Register</a></li>,
      logout: <li><a href="#" onClick={this._logout}>Log out</a></li>,
      profile: <li className="username">({name})</li>
    };

    if (radio) activeMenuItems.push(menuItems.newRadio);
    else activeMenuItems.push(menuItems.newRadio);

    if (isGuest) {
      activeMenuItems.push(menuItems.login);
      activeMenuItems.push(menuItems.register);
    } else {
      activeMenuItems.push(menuItems.logout);
      activeMenuItems.push(menuItems.profile);
    }

    return (
      <ul className="right hide-on-med-and-down">
        {activeMenuItems}
      </ul>
    );
  }
}

Menu.propTypes = {
  dispatch: React.PropTypes.func,
  radio: React.PropTypes.object,
  user: React.PropTypes.object
};

export default connect()(Menu);
