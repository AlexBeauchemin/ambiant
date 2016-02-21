import React from 'react';

export default ({onClick, name}) => (
  <li>
    {name}
    <button onClick={onClick}>Delete</button>
  </li>
);