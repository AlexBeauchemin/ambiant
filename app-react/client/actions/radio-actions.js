import * as types from '../constants/action-types';

const createRadio = (name) => {
  return () => {
    Meteor.call('radio.create', name);
  };
};

const removeRadio = (id) => {
  return () => {
    Meteor.call('radio.remove', id);
  };
};

const setOwnRadio = (radio) => {
  return {
    radio,
    type: types.SET_OWN_RADIO
  };
};

const setRadio = (radio) => {
  return {
    radio,
    type: types.SET_RADIO
  };
};

const toggleShowMore = () => {
  return {
    type: types.TOGGLE_SHOW_MORE
  };
};

export { createRadio, removeRadio, setOwnRadio, setRadio, toggleShowMore };
