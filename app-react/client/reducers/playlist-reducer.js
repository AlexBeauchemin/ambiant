import * as types from '../constants/action-types';

const defaultState = {
  showMore: false
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case types.TOGGLE_SHOW_MORE:
      return Object.assign({}, state, { showMore: !state.showMore });
    default:
      return state;
  }
};
