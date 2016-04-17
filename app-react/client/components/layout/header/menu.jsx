import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modal-actions';
import { bindAll, get as _get } from 'lodash';

class Menu extends Component {
  constructor(props) {
    super(props);

    bindAll(this, ['open', 'logout']);
  }

  open(e) {
    const { dispatch } = this.props;
    const item = e.currentTarget.dataset.target;

    e.preventDefault();
    dispatch(openModal(item));
  }

  logout(e) {
    e.preventDefault();

    Meteor.logout((error) => {
      if (error) Materialize.toast(error.reason, 5000);
    });
  }

  render() {
    const { radio, user, page } = this.props;
    const activeMenuItems = [];
    const isGuest = _get(user, 'profile.guest');
    const radioUrl = radio ? `/${radio.url}` : '#';
    const name = _get(user, 'profile.name');

    const menuItems = {
      newRadio: <li><a href="#" data-target="new-radio" onClick={this.open}>New radio</a></li>,
      myRadio: <li><a href={radioUrl}>My radio</a></li>,
      login: <li><a href="#" data-target="login" onClick={this.open}>Log In</a></li>,
      register: <li><a href="#" data-target="register" onClick={this.open}>Register</a></li>,
      logout: <li><a href="#" onClick={this.logout}>Log out</a></li>,
      profile: <li className="username">({name})</li>
    };
    
    if (radio && page !== 'radio') activeMenuItems.push(menuItems.myRadio);
    if (!radio) activeMenuItems.push(menuItems.newRadio);

    if (isGuest) {
      activeMenuItems.push(menuItems.login);
      activeMenuItems.push(menuItems.register);
    } else {
      activeMenuItems.push(' '); // Weird bug, logout onClick event get automatically called if it's the first item pushed in the array
      activeMenuItems.push(menuItems.logout);
      activeMenuItems.push(menuItems.profile);
    }
    
    console.log(activeMenuItems);

    return (
      <ul className="right hide-on-med-and-down">
        {activeMenuItems}
      </ul>
    );
  }
}

Menu.propTypes = {
  dispatch: PropTypes.func,
  page: PropTypes.string,
  radio: PropTypes.object,
  user: PropTypes.object
};

export default connect()(Menu);
