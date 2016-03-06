import React from 'react';
import * as ReactRedux from 'react-redux';
import store from '../store/store';
import DevTools from '../containers/dev-tools.jsx';
import HeaderContainer from '../containers/header-container.jsx';
import ModalsContainer from '../containers/modals-container.jsx';

const { Provider } = ReactRedux;
const initialState = {};

class Layout extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <Provider store={ store(initialState) }>
        <div>
          <HeaderContainer />
          {content}
          <ModalsContainer />
          <DevTools />
        </div>
      </Provider>
    );
  }
}

Layout.propTypes = {
  content: React.PropTypes.object
};

export default Layout;