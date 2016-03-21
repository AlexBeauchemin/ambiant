import * as types from '../constants/action-types';

const createRadio = (name, callback) => {
  return () => {
    Meteor.call('radio.create', name, (error, res) => {
      if (error) Materialize.toast(error.reason, 5000);
      else if (callback) callback(res);
    });
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
