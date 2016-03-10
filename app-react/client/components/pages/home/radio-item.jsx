import React from 'react';

export default ({ radios, modal }) => (
  <ul>
    { radios.map(radio =>
        <li>{radio.name}</li>
    )}
  </ul>
);