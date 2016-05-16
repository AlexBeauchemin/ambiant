import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import Radio from '../components/pages/radio.jsx';
import { SHOW_SINGLE } from '../../lib/shared/constants/radios-filters.js';

const meteorComposer = (props, onData) => {
  const { slug } = props;
  const isReady = Meteor.subscribe('getRadios', SHOW_SINGLE, slug).ready();
  const user = Meteor.user();
  const userId = user ? user._id : null;

  if (isReady && userId) {
    const radio = Radios.findOne({ url: slug });

    onData(null, { radio });
  }
};

// const mapStateToProps = (state) => {
//   return {
//     playlist: state.playlist,
//     playlistEnded: state.playlistEnded,
//     radio: state.radio
//   };
// };

//const element = composeWithTracker(meteorComposer)(Radio);
export default composeWithTracker(meteorComposer)(Radio);

//export default connect(mapStateToProps)(element);
