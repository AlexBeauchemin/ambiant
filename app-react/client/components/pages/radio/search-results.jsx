import React from 'react';
import { map } from 'lodash';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = { songId: null };
  }

  addSong(e) {
    e.preventDefault();

    const id = e.target.dataset.id;

    /*App[domain].getSongInfo(id, (tracks) => {
      _.forEach(tracks, (track,index) => {
        const id = track.id || ref;
        const trackInfo = {
          id,
          type: 'user-added',
          data: track,
          domain: domain
        };

        // TODO: Bundle servers call in a single add-songs call
        Meteor.call('radio.add-song-to-playlist', trackInfo, radioId, (error, res) => {
          if (error) Materialize.toast(error.reason, 5000);
          else Materialize.toast(`Song "${track.title}" added!`, 3000, 'normal');

          if (index === tracks.length - 1) {
            Session.set('isAddingSong', false);
            this.resetValues();
            $(this.selector).focus();
          }
        });
      });
    });*/
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
  data: React.PropTypes.array
};

export default SearchResults;
