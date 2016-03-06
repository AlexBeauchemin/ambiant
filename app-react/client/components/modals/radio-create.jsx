import React from 'react';
import { connect } from 'react-redux';
import { createRadio } from '../../actions/radio-actions';
import { closeModal } from '../../actions/modal-actions';
import _ from 'lodash';

class CreateModal extends React.Component {
  constructor(props) {
    super(props);

    this._input = null;
    _.bindAll(this, ['_addRadio', '_setInput']);
  }

  _addRadio(e) {
    const { dispatch } = this.props;

    e.preventDefault();

    dispatch(createRadio(this._input.value));
    dispatch(closeModal());
    this._input.value = '';
  }

  _setInput(node) {
    this._input = node;
  }

  render() {
    return (
      <form className="modal create-error" data-name="new-radio" onSubmit={ this._addRadio }>
        <div className="modal-content">
          <h4>New radio</h4>

          <div className="input-field">
            <input type="text" name="radio-name" id="radio-name" ref={ this._setInput } />
            <label htmlFor="radio-name">Radio Name</label>
          </div>
        </div>
        <div className="modal-footer">
          <button type="submit" className="modal-action waves-effect waves-light btn-flat">Create</button>
        </div>
      </form>
    );
  }
}

CreateModal.propTypes = {
  dispatch: React.PropTypes.func
};

export default connect()(CreateModal);
