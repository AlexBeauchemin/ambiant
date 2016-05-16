import { combineReducers } from 'redux';

import modal from './modal-reducer';
import pageSkip from './page-skip-reducer';
import radiosFilter from './radios-filter-reducer';
import playlist from './playlist-reducer';
import radio from './radio-reducer';
import search from './search-reducer';

export default combineReducers({
  modal,
  pageSkip,
  playlist,
  radio,
  radiosFilter,
  search
});
