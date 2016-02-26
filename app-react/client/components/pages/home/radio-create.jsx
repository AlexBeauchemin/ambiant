import React from 'react';
import { connect } from 'react-redux';
import { createRadio } from '../../../actions/radio-actions';

const RadioCreate = ({dispatch}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }}/>
      <button onClick={() => {
            dispatch(createRadio(input.value));
            input.value = '';
          }}>
        Create radio!
      </button>
    </div>
  )
};

export default connect()(RadioCreate);