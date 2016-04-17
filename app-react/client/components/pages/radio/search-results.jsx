import React from 'react';
import { bindAll, forEach, map } from 'lodash';
import MusicProvider from '../../../lib/utils/music-provider.js';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = { songId: null };
    bindAll(this, ['addSong']);
  }

  addSong(e) {
    e.preventDefault();

    const songId = e.target.dataset.id;
    const radioId = this.props.radioId;

    MusicProvider.current.getSongInfo(songId)
      .then((tracks) => {
        forEach(tracks, (track, index) => {
          const id = track.id || songId;
          const domain = MusicProvider.name;
          const trackInfo = {
            id,
            domain,
            type: 'user-added',
            data: track
          };

          // TODO: Bundle servers call in a single add-songs call
          Meteor.call('radio.add-song-to-playlist', trackInfo, radioId, (error, res) => {
            if (error) Materialize.toast(error.reason, 5000);
            else Materialize.toast(`Song "${track.title}" added!`, 3000, 'normal');

            /* if (index === tracks.length - 1) {
              Session.set('isAddingSong', false);
              this.resetValues();
              $(this.selector).focus();
            } */
          });
        });
      })
      .catch((err) => {
        Materialize.toast(err, 5000);
      });
  }

  render() {
    const { data } = this.props;

    return (
      <div id="search-result" className="collection">
        { map(data, (item) => {
          return (
            <a key={item.id} href="#" className="collection-item" data-id={item.id} onClick={this.addSong}>
              {item.title}
            </a>
          );
        })}
      </div>
    );
  }
}

SearchResults.propTypes = {
  data: React.PropTypes.array,
  radioId: React.PropTypes.string
};

export default SearchResults;
