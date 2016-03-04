import React from 'react';
import { connect } from 'react-redux';
import { openModal, closeModal } from '../../../actions/modal-actions';
import _ from 'lodash';

const Menu = ({dispatch, radio, user}) => {
  let activeMenuItems = [];
  const isGuest = _.get(user, 'profile.guest');
  const radioUrl = radio ? `/${radio.url}` : '#';
  const name = _.get(user, 'profile.name');

  console.log(user);

  const open = (e, item) => {
    e.preventDefault();
    dispatch(openModal(item));
  };

  const logout = () => {
    Meteor.logout((error) => {
      if (error) Materialize.toast(error.reason, 5000);
    });
  };

  const menuItems = {
    newRadio: <li><a href="#" onClick={(e) => open(e, 'new-radio')}>New radio</a></li>,
    myRadio: <li><a href={radioUrl}>My radio</a></li>,
    login: <li><a href="#" onClick={(e) => open(e, 'login')}>Log In</a></li>,
    register: <li><a href="#" onClick={(e) => open(e, 'register')}>Register</a></li>,
    logout: <li><a href="#" onClick={ logout }>Log out</a></li>,
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
  )
};

export default connect()(Menu);