import React, { PropTypes } from 'react';
import { isEmpty, map } from 'lodash';
import PlaylistItem from './playlist-item.jsx';

const Playlist = ({ ended, playlist }) => {
  let elEmptyPlaylist = null;
  let elShowMore = null;
  let showMoreText = 'Show More';

  if (isEmpty(playlist)) {
    elEmptyPlaylist = (
      <div className="collection-item collection-empty">
        <p className="center-align"><span className="title">This playlist is empty</span></p>
      </div>
    );
  }

  if (ended && ended.length > 2) {
    elShowMore = (
      <div className="collection-item collection-show-more">
        <p className="center-align"><a href="#">{showMoreText}</a></p>
      </div>
    );
  }

  return (
    <div className="playlist">
      <div className="collection with-header">
        <div className="collection-header">
          <h3>Playlist</h3>
        </div>
        {elEmptyPlaylist}
        {elShowMore}
        {map(ended, (song) => <PlaylistItem key={song.uuid} song={song} state="ended" />)}
        {map(playlist, (song) => <PlaylistItem key={song.uuid} song={song} state={song.state} />)}
      </div>
    </div>
  );
};

Playlist.propTypes = {
  ended: PropTypes.array,
  playlist: PropTypes.array
};

export default Playlist;
