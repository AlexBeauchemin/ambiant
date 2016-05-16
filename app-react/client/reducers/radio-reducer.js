import * as types from '../constants/action-types';
import { omit, pick } from 'lodash';

const defaultState = {
  data: null,
  own: null,
  state: 'stop'
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case types.SET_OWN_RADIO: {
      const own = pick(action.radio, ['_id', 'name', 'url']);
      return Object.assign({}, state, { own });
    }
    case types.SET_RADIO: {
      const data = omit(action.radio, ['playlist', 'playlistEnded']);
      return Object.assign({}, state, { data });
    }
    default:
      return state;
  }
};
