import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/modal-actions';
import ModalRadioCreate from '../components/modals/radio-create.jsx';
import ModalLogin from '../components/modals/login.jsx';

class Modals extends React.Component {
  componentWillReceiveProps(props) {
    const { dispatch } = this.props;
    const modal = `.modal[data-name="${props.modal}"]`;

    if (props.modal) {
      const $modal = $(modal);

      if (!$modal.length) return;

      $modal.openModal({
        complete() {
          dispatch(closeModal());
        },
        ready() {
          $modal.find('input').first().trigger('click').trigger('focus');
        }
      });
    } else {
      $('.modal').closeModal();
    }
  }

  render() {
    return (
      <div>
        <ModalRadioCreate />
        <ModalLogin />
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
