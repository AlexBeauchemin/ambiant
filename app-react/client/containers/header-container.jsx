import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import { setOwnRadio } from '../actions/radio-actions';
import { SHOW_OWN } from '../../lib/shared/constants/radios-filters';
import Header from '../components/layout/header.jsx';

const composer = (props, onData) => {
  const { dispatch } = props;
  const isReady = Meteor.subscribe('getRadios', SHOW_OWN).ready();
  const user = Meteor.user();
  const userId = user ? user._id : null;

  if (isReady && userId) {
    const radio = Radios.findOne();
    if (radio) dispatch(setOwnRadio(radio));
    onData(null, { radio, user });
  }
};

const header = composeWithTracker(composer)(Header);

export default connect()(header);
