import * as types from '../constants/action-types';

export function setDomain(domain) {
  return {
    domain,
    type: types.SET_DOMAIN
  };
}

export function setIsSearching(isSearching) {
  return {
    isSearching,
    type: types.SET_IS_SEARCHING
  };
}

export function setSearchResults(results) {
  return {
    results,
    type: types.SET_SEARCH_RESULTS
  };
}
