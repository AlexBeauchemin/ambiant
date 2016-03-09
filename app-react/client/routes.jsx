import React from 'react';
import { mount } from 'react-mounter';

import Layout from './components/layout.jsx';
import PageHome from './containers/home-container.jsx';

FlowRouter.route('/', {
  action() {
    mount(Layout, {
      content: (<PageHome />)
    });
  },
  name: 'home'
});
