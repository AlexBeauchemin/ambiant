import { connect } from 'react-redux';
import { composeWithTracker } from 'react-komposer';
import Radios from '../components/pages/home/radio-item.jsx';

const composer = (props, onData) => {
  console.log('props', props);
  const isReady = Meteor.subscribe('getRadios', 'SHOW_NEW').ready();

  if (isReady) {
    const radios = Radios.find({}).fetch() || [];
    onData(null, { radios });
  }
};

const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};


// const radiosContainer = connect(mapStateToProps)(Radios);

export default composeWithTracker(composer)(Radios);
