import React from 'react';
import * as ReactRedux from 'react-redux';
import Store from '../store/store';

const { Provider } = ReactRedux;

// define and export our Layout component
export default ({content}) => (
  <Provider store={Store}>
    {content}
  </Provider>
);