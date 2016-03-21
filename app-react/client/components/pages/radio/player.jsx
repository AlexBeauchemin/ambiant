import React from 'react';

class Player extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <p>Player</p>
    );
  }
}

Player.propTypes = {
  data: React.PropTypes.array
};

export default Player;
