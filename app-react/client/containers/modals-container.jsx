import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/modal-actions';

import ModalRadioCreate from '../components/modals/radio-create.jsx';

class Modals extends React.Component {
  componentWillReceiveProps(props) {
    const { dispatch } = this.props;
    const modal = `.modal[data-name="${props.modal}"]`;

    if (props.modal) $(modal).openModal({complete: () => {
      dispatch(closeModal());
    }});
    else {
      $('.modal').closeModal();
    }
  }

  render() {
    return (
      <div>
        <ModalRadioCreate />
      </div>
    );
  }
}

Modals.propTypes = {
  modal: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};

export default connect(mapStateToProps)(Modals);