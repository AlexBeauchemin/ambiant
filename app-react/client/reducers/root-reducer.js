import * as Redux from 'redux';

import modal from './modal-reducer.js';
import pageSkip from './page-skip-reducer.js';
import radiosFilter from './radios-filter-reducer.js';

const { combineReducers } = Redux;

export default combineReducers({
  modal,
  pageSkip,
  radiosFilter
});