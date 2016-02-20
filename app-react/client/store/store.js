import * as Redux from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/root-reducer.js';

const { applyMiddleware, createStore, compose } = Redux;

const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);

export default createStoreWithMiddleware(rootReducer);