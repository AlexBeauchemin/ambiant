import React from 'react';

class Playlist extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <p>Playlist</p>
    );
  }
}

Playlist.propTypes = {
  data: React.PropTypes.array
};

export default Playlist;
