import React from 'react';
import { get as _get } from 'lodash';
import { getSongImage } from '../../../lib/utils/radio';

class Radio extends React.Component {
  render() {
    const { name, url, playlist, twitchChannel } = this.props;
    const playlistFirstItem = playlist[0];
    const title = _get(playlistFirstItem, 'data.title') || 'Unnamed song';
    const twitchUrl = `http://www.twitch.tv/${twitchChannel}`;

    let twitchTag;

    if (twitchChannel) {
      twitchTag = <a href={twitchUrl} className="right twitch" target="_blank"><img src="/twitch.png" alt="Twitch channel" /></a>;
    }

    return (
      <div className="radio-container col s12 m4 l3">
        <div className="radio z-depth-1">
          <h2>
            <a href={`/${url}`}>{name}</a>
            {twitchTag}
          </h2>
          <div className="song">
            <p className="subtitle center-align">Currently playing</p>
            <a href={`/${url}`}>
              <img src={getSongImage(playlistFirstItem)} alt="" />
            </a>
          </div>
          <p className="song-title">{title}</p>
        </div>
      </div>
    );
  }
}

Radio.propTypes = {
  name: React.PropTypes.string,
  playlist: React.PropTypes.array,
  twitchChannel: React.PropTypes.string,
  url: React.PropTypes.string
};

export default Radio;
