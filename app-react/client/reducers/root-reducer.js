import visibilityFilter from './visibility-reducer.js';
import pageSkip from './page-skip-reducer.js';

const { combineReducers } = Redux;

export default combineReducers({
  visibilityFilter,
  pageSkip
});