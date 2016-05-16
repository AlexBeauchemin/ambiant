import * as types from '../constants/action-types';

const defaultState = {
  ended: [],
  songs: [],
  showMore: false
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case types.SET_PLAYLIST: {
      const { playlist: songs, playlistEnded: ended } = action;
      return Object.assign({}, state, { songs, ended });
    }
    case types.TOGGLE_SHOW_MORE:
      return Object.assign({}, state, { showMore: !state.showMore });
    default:
      return state;
  }
};
