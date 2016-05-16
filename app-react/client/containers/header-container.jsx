import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { SHOW_OWN } from '../../lib/shared/constants/radios-filters';
import Header from '../components/layout/header.jsx';

const composer = (props, onData) => {
  const { page } = props;
  const isReady = Meteor.subscribe('getRadios', SHOW_OWN).ready();
  const user = Meteor.user();
  const userId = user ? user._id : null;

  if (isReady && userId) {
    const radio = Radios.findOne({ users: userId }) || null;
    
    onData(null, { radio, user, page });
  }
};

const header = composeWithTracker(composer)(Header);

export default connect()(header);
