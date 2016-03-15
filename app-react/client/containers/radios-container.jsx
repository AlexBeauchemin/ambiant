import { composeWithTracker } from 'react-komposer';
import { connect } from 'react-redux';
import RadioList from '../components/pages/home/radio-item.jsx';
import { SHOW_NEW } from '../../lib/shared/constants/radios-filters';

const composer = (props, onData) => {
  const isReady = Meteor.subscribe('getRadios', props.radiosFilter).ready();

  if (isReady) {
    const radios = Radios.find({}).fetch() || [];
    onData(null, { radios });
  }
};

const radios = composeWithTracker(composer)(RadioList);

const mapStateToProps = (state) => {
  return {
    radiosFilter: state.radiosFilter
  };
};

export default connect(mapStateToProps)(radios);
