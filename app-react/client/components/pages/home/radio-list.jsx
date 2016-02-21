import React from 'react';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import { remove } from '../../../actions/radio-actions';
import RadioItem from './radio-item.jsx';

const RadioList = class RadioList extends React.Component {
  getMeteorData() {
    const { pageSkip, visibilityFilter } = this.props;
    const radioSub = Meteor.subscribe('getRadios', visibilityFilter, pageSkip);
    return {
      radioSubReady: radioSub.ready(),
      radioList: Radios.find({}, {limit: 10}).fetch() || []
    }
  }

  render() {
    const { dispatch } = this.props;
    const radios = this.data.radioList;
    return (
      <div>
        <ul>
          {radios.map(radio =>
              <RadioItem
                key={radio._id}
                {...radio}
                onClick={() => dispatch(remove(radio._id))}
                />
          )}
        </ul>
      </div>
    )
  }
};

reactMixin(RadioList.prototype, ReactMeteorData);

const mapStateToProps = (state) => {
  return {
    visibilityFilter: state.visibilityFilter,
    pageSkip: state.pageSkip
  }
};

export default connect(mapStateToProps)(RadioList);