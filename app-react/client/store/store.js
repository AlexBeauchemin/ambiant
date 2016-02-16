import rootReducer from '../reducers/root-reducer.js';

const { applyMiddleware, createStore } = Redux;
const logger = createLogger();
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, logger)(createStore);

export default createStoreWithMiddleware(rootReducer);