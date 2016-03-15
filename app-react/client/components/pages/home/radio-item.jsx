import React from 'react';

class Item extends React.Component {
  render() {
    const { radios } = this.props;

    return (
      <ul>
        { radios.map(radio =>
            <li>{radio.name}</li>
        )}
      </ul>
    );
  }
}

Item.propTypes = {
  radios: React.PropTypes.array
};

export default Item;
