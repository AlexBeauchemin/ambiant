import * as Redux from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/root-reducer.js';
import DevTools from '../containers/dev-tools.jsx';

const { applyMiddleware, createStore, compose } = Redux;
const logger = createLogger();
const middleware = applyMiddleware(thunkMiddleware, logger);

let enhancer = middleware;

if (__DEV__) {
  enhancer = compose(
    middleware,
    DevTools.instrument()
  );
}

export default (initialState) => {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/root-reducer');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
