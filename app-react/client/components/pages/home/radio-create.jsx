import React from 'react';
import { connect } from 'react-redux';
import { create } from '../../../actions/radio-actions';

const RadioCreate = ({dispatch}) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }}/>
      <button onClick={() => {
            dispatch(create(input.value));
            input.value = '';
          }}>
        Create radio!
      </button>
    </div>
  )
};

export default connect()(RadioCreate);