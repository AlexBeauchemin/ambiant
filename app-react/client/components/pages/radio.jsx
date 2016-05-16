import React, { Component, PropTypes } from 'react';
import Loader from '../shared/loader.jsx';
import RadioHeader from './radio/header.jsx';
import Player from './radio/player.jsx';
import Playlist from './radio/playlist.jsx';
import Settings from './radio/settings.jsx';
import SearchBar from './radio/search-bar.jsx';
import { get, isEmpty } from 'lodash';

const Radio = ({ radio }) => {
  if (radio === null) return <Loader />;

  const isAdmin = radio ? !!radio.users : false;
  let settings = null;

  if (isEmpty(radio)) {
    return (
      <div className="row">
        <h2 className="center-align space-top">Radio not found</h2>
      </div>
    );
  }

  if (isAdmin) settings = <Settings />;

  return (
    <div className="container">
      <RadioHeader isAdmin={isAdmin} radio={radio} />
      <div className="row">
        <div className={ isAdmin ? 'col s12 m7' : 'col s12' }>
          <SearchBar radioId={radio._id} />
          <Player />
        </div>
        <div className={ isAdmin ? 'col s12 m5' : 'col s12' }>
          {settings}
          <Playlist playlist={radio.playlist} ended={radio.playlistEnded} />
        </div>
      </div>
    </div>
  );
};

Radio.propTypes = {
  radio: PropTypes.object
};

export default Radio;
