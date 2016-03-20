import React from 'react';
import { mount } from 'react-mounter';

import Layout from './components/layout.jsx';
import PageHome from './containers/home-container.jsx';
import PageRadio from './containers/radio-container.jsx';

FlowRouter.route('/', {
  action() {
    mount(Layout, {
      content: (<PageHome />)
    });
  },
  name: 'home'
});

FlowRouter.route('/:slug', {
  action(params) {
    const slug = params.slug.toLowerCase();
    
    mount(Layout, {
      content: (<PageRadio slug={slug} />)
    });
  },
  name: 'radio'
});

FlowRouter.route('/radio/:slug', {
  triggersEnter: [(context, redirect) => {
    redirect(`/${context.params.slug}`);
  }]
});
