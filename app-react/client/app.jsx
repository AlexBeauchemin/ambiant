import React from 'react';
import Store from './store/store.js';
const { Provider } = ReactRedux;

// define and export our Layout component
export const Layout = ({content}) => (
  <Provider store={Store}>
    {content}
  </Provider>
);

// define and export our Welcome component
export const Welcome = ({name}) => (
  <div>
    Hello, {name}.
  </div>
);