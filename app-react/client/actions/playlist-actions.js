import * as types from '../constants/action-types';

export function setPlaylist(playlist, playlistEnded) {
  return {
    playlist,
    playlistEnded,
    type: types.SET_PLAYLIST
  };
}

export function toggleShowMore() {
  return {
    type: types.TOGGLE_SHOW_MORE
  };
}
