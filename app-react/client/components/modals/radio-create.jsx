import React from 'react';

export default () => {
  return (
    <form className="modal create-error" data-name="new-radio" onSubmit={() => { console.log('submit'); }}>
      <div className="modal-content">
        <h4>New radio</h4>
        <div className="input-field">
          <input type="text" name="radio-name" id="radio-name" />
          <label htmlFor="radio-name">Radio Name</label>
        </div>
      </div>
      <div className="modal-footer">
        <button type="submit" className="modal-action waves-effect waves-light btn-flat">Create</button>
      </div>
    </form>
  );
};