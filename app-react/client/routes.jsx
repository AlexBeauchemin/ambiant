import React from 'react';
import {mount} from 'react-mounter';

import Layout from './components/layout.jsx';
import PageHome from './components/pages/home.jsx';

FlowRouter.route("/", {
  action() {
    mount(Layout, {
      content: (<PageHome name="arunoda"/>)
    });
  }
});