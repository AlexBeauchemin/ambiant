import React from 'react';
import * as ReactRedux from 'react-redux';
import Store from '../store/store';
import DevTools from '../containers/dev-tools.jsx';
import HeaderContainer from '../containers/header-container.jsx';
import ModalsContainer from '../containers/modals-container.jsx';

const { Provider } = ReactRedux;
const initialState = {};

export default ({content}) => (
  <Provider store={Store(initialState)}>
    <div>
      <HeaderContainer />
      {content}
      <ModalsContainer />
      <DevTools />
    </div>
  </Provider>
);