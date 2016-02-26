import * as types from '../constants/action-types.js';

const initialState = null;

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case types.OPEN_MODAL:
      return action.modal;
    case types.CLOSE_MODAL:
      return null;
    default:
      return state;
  }
};