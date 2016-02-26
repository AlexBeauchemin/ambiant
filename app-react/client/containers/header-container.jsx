import {composeWithTracker} from 'react-komposer';
import Header from '../components/layout/header.jsx';
import _ from 'lodash';

const composer = (props, onData) => {
  const isReady = Meteor.subscribe('getRadios', 'SHOW_OWN').ready();
  const userId = _.get(Meteor.user(), '_id');
  let radio;

  if (isReady && userId) {
    radio = Radios.findOne({users: userId});
    onData(null, {radio});
  }
};

export default composeWithTracker(composer)(Header);