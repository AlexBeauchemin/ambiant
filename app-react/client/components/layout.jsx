import React from 'react';
import * as ReactRedux from 'react-redux';
import store from '../store/store';
import DevTools from '../containers/dev-tools.jsx';
import HeaderContainer from '../containers/header-container.jsx';
import ModalsContainer from '../containers/modals-container.jsx';

const { Provider } = ReactRedux;
const initialState = {};

class Layout extends React.Component {
  componentWillMount() {
    WebFont.load({
      google: {
        families: ['Open+Sans:400,300,700:latin', 'Courgette::latin', 'Material+Icons']
      }
    });
  }
  
  render() {
    const { content } = this.props;
    const routeName = FlowRouter.current().route.name;

    return (
      <Provider store={store(initialState)}>
        <div data-route={routeName}>
          <HeaderContainer page={routeName} />
          <main>{content}</main>
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
