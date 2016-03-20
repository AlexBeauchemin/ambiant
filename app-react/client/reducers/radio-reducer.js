import * as types from '../constants/action-types';
import { omit, pick } from 'lodash';

const defaultState = {
  data: null,
  domain: 'youtube',
  own: null,
  playlist: [],
  showMore: false,
  song: null,
  state: 'stop'
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case types.SET_PLAYLIST:
      return Object.assign({}, state, { data: action.playlist });
    case types.SET_OWN_RADIO: {
      const own = pick(action.radio, ['_id', 'name', 'url']);
      return Object.assign({}, state, { own });
    }
    case types.SET_RADIO: {
      const data = omit(action.radio, ['playlist', 'playlistEnded']);
      return Object.assign({}, state, { data });
    }
    case types.SET_SONG:
      return Object.assign({}, state, { song: action.song, domain: action.song.domain });
    case types.TOGGLE_SHOW_MORE:
      return Object.assign({}, state, { showMore: !state.showMore });
    default:
      return state;
  }
};
