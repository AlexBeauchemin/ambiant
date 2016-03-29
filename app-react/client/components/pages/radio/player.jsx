import React from 'react';
import MusicProvider from '../../../lib/utils/music-provider';
import { get as _get } from 'lodash';

class Player extends React.Component {
  render() {
    const { data } = this.props;
    const domain = 'youtube';

    return (
      <div className={`video video-wrapper ${domain}`}>
        <div id="youtube-player"></div>
        <iframe id="soundcloud-player" src="https://w.soundcloud.com/player/?url=http://api.soundcloud.com" width="100%" height="465" scrolling="no" frameBorder="no"></iframe>
      </div>
    );
  }

  componentDidMount() {
    const soundcloudApiKey = _get(Meteor.settings, 'public.soundCloudApiKey');
    const youtubeApiKey = _get(Meteor.settings, 'public.youtubeApiKey');

    MusicProvider.soundcloud.init({
      apiKey: soundcloudApiKey,
      element: 'soundcloud-player'
    });
    MusicProvider.youtube.init({
      apiKey: youtubeApiKey,
      element: 'youtube-player'
    });
  }
}

Player.propTypes = {
  data: React.PropTypes.array
};

export default Player;
