import { composeWithTracker } from 'react-komposer';
import Home from '../components/pages/home.jsx';
import { SHOW_OWN } from '../../lib/shared/constants/radios-filters';

const composer = (props, onData) => {
  const isReady = Meteor.subscribe('getRadios', SHOW_OWN).ready();
  const user = Meteor.user();
  const userId = user ? user._id : null;

  if (isReady && userId) {
    const radio = Radios.findOne({ users: userId });
    onData(null, { radio });
  }
};

export default composeWithTracker(composer)(Home);
