import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from '../actions/modal-actions';
import ModalRadioCreate from '../components/modals/radio-create.jsx';
import ModalLogin from '../components/modals/login.jsx';
import ModalRegister from '../components/modals/register.jsx';
import socialLoginWrapper from '../components/modals/socialLoginWrapper.jsx';

class Modals extends React.Component {
  componentWillReceiveProps(props) {
    const modal = `.modal[data-name="${props.modal}"]` || '.modal';
    const $modal = $(modal);

    if (!props.modal) return this.close();

    this.open($modal);
  }

  close() {
    $('.modal').closeModal();
    $('.lean-overlay').css('display', 'none');
  }

  open($modal) {
    const { dispatch } = this.props;

    if (!$modal.length) return;

    $modal.openModal({
      complete() {
        dispatch(closeModal());
      },
      ready() {
        $modal.find('input').first().trigger('click').trigger('focus');
      }
    });
  }

  render() {
    const ModalLoginWrapper = socialLoginWrapper(ModalLogin);
    const ModalRegisterWrapper = socialLoginWrapper(ModalRegister);

    return (
      <div>
        <div className="modal" data-name="new-radio">
          <ModalRadioCreate />
        </div>
        <div className="modal" data-name="login">
          <ModalLoginWrapper />
        </div>
        <div className="modal" data-name="register">
          <ModalRegisterWrapper />
        </div>
      </div>
    );
  }
}

Modals.propTypes = {
  dispatch: React.PropTypes.func,
  modal: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    modal: state.modal
  };
};

export default connect(mapStateToProps)(Modals);
