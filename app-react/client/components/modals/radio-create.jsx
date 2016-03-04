import React from 'react';
import { connect } from 'react-redux';
import { createRadio } from '../../actions/radio-actions';
import { closeModal } from '../../actions/modal-actions';

const CreateModal = ({dispatch}) => {
  let input;

  const addRadio = (e) => {
    e.preventDefault();

    dispatch(createRadio(input.value));
    dispatch(closeModal());
    input.value = '';
  };

  return (
    <form className="modal create-error" data-name="new-radio" onSubmit={ addRadio }>
      <div className="modal-content">
        <h4>New radio</h4>
        <div className="input-field">
          <input type="text" name="radio-name" id="radio-name" ref={node => { input = node; }} />
          <label htmlFor="radio-name">Radio Name</label>
        </div>
      </div>
      <div className="modal-footer">
        <button type="submit" className="modal-action waves-effect waves-light btn-flat">Create</button>
      </div>
    </form>
  );
};

export default connect()(CreateModal);