import React from 'react';
import {mount} from 'react-mounter';
import {Layout, Welcome} from './app.jsx';

FlowRouter.route("/", {
  action() {
    mount(Layout, {
      content: (<Welcome name="arunoda"/>)
    });
  }
});