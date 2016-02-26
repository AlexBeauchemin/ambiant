import React from 'react';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../actions/modal-actions';
import _ from 'lodash';

const Menu = ({dispatch, radio}) => {
  let activeMenuItems = [];
  const isGuest = _.get(Meteor.user(), 'profile.guest');
  const menuItems = {
    newRadio: <li><a href="#" onClick={() => dispatch(openModal('new-radio'))}>New radio</a></li>,
    myRadio: <li><a href="/{{myRadio.url}}">My radio</a></li>,
    login: <li><a href="#modal-login" data-action="open-login-modal">Log In</a></li>,
    register: <li><a href="#modal-register" data-action="open-register-modal">Register</a></li>,
    logout: <li><a href="#" data-action="logout">Log out</a></li>,
    profile: <li className="username">currentUser.profile.name</li>
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
  )
};

export default connect()(Menu);