import * as types from '../constants/action-types';

export function createRadio(name, callback) {
  return () => {
    Meteor.call('radio.create', name, (error, res) => {
      if (error) Materialize.toast(error.reason, 5000);
      else if (callback) callback(res);
    });
  };
}

export function removeRadio(id) {
  return () => {
    Meteor.call('radio.remove', id);
  };
}

export function setOwnRadio(radio) {
  return {
    radio,
    type: types.SET_OWN_RADIO
  };
}

export function setPlaylist(playlist) {
  return {
    playlist,
    type: types.SET_PLAYLIST
  };
}

export function setRadio(radio) {
  return {
    radio,
    type: types.SET_RADIO
  };
}

export function toggleShowMore() {
  return {
    type: types.TOGGLE_SHOW_MORE
  };
}
