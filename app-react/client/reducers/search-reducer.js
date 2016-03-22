import * as types from '../constants/action-types';

const defaultState = {
  domain: 'youtube',
  isSearching: false,
  results: []
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case types.SET_DOMAIN:
      return Object.assign({}, state, { domain: action.domain });
    case types.SET_IS_SEARCHING:
      return Object.assign({}, state, { isSearching: !!action.isSearching });
    case types.SET_SEARCH_RESULTS:
      return Object.assign({}, state, { results: action.results });
    default:
      return state;
  }
};
