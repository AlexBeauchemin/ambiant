import * as types from '../constants/action-types';

const defaultState = {
  state: 'stop'
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case types.SET_STATE: {
      return Object.assign({}, state, { state: action.payload });
    }
    default:
      return state;
  }
};
