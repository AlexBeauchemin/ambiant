import { composeWithTracker } from 'react-komposer';
import Radio from '../components/pages/radio.jsx';
import { SHOW_SINGLE } from '../../lib/shared/constants/radios-filters';

const composer = (props, onData) => {
  const { slug } = props;
  const isReady = Meteor.subscribe('getRadios', SHOW_SINGLE, slug).ready();
  const user = Meteor.user();
  const userId = user ? user._id : null;

  if (isReady && userId) {
    const subRadio = Radios.findOne({ url: slug });
    onData(null, { subRadio });
  }
};

export default composeWithTracker(composer)(Radio);
