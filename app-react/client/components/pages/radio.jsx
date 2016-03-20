import React from 'react';
import { connect } from 'react-redux';
import { setRadio } from '../../actions/radio-actions';
import Loader from '../shared/loader.jsx';
import RadioHeader from './radio/header.jsx';
import { get as _get } from 'lodash';

class Radio extends React.Component {
  componentWillMount() {
    const { dispatch, subRadio } = this.props;
    dispatch(setRadio(subRadio));
  }

  componentWillReceiveProps(props) {
    const { dispatch, subRadio } = this.props;
    if (subRadio._id !== props.subRadio._id) {
      dispatch(setRadio(props.subRadio));
    }
  }

  render() {
    const { radio } = this.props;
    const isAdmin = _get(radio, 'own._id') === _get(radio, 'data._id');

    if (radio.data === null) return <Loader />;
    if (radio.data === undefined) {
      return (
        <div className="row">
          <h2 className="center-align space-top">Radio not found</h2>
        </div>
      );
    }

    return (
      <div className="container">
        <RadioHeader isAdmin={isAdmin} radio={radio.data} />
      </div>
    );
  }
}

Radio.propTypes = {
  dispatch: React.PropTypes.func,
  isAdmin: React.PropTypes.bool,
  radio: React.PropTypes.object,
  subRadio: React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    radio: state.radio
  };
};

export default connect(mapStateToProps)(Radio);
