import { combineReducers } from 'redux';

import modal from './modal-reducer';
import pageSkip from './page-skip-reducer';
import radiosFilter from './radios-filter-reducer';
import radio from './radio-reducer';
import searchDomain from './search-reducer';

export default combineReducers({
  modal,
  pageSkip,
  radio,
  radiosFilter,
  searchDomain
});
