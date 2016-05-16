import React, { PropTypes } from 'react';
import { get } from 'lodash';


const PlaylistItem = ({ song, state }) => {
  const image = get(song, 'data.thumbnails.default.url') || '/album-default.jpg';
  const title = song.data.title;
  const link = get(song, 'data.link') || `http://youtu.be/${song.id}`;
  const user = get(song, 'user.name');
  
  let elUser = null;
  
  if (user) elUser = <p className="smaller">Added by : {song.user.name}</p>;
  
  return (
    <div className="collection-item avatar" data-state={state}>
      <img src={image} alt="" className="circle" />
        <div className="info">
          <p><a href={link} target="_blank">{title}</a></p>
          {elUser}
        </div>
        <div className="smaller time">{song.data.duration}</div>
    </div>
  );
};

PlaylistItem.propTypes = {
  song: PropTypes.object,
  state: PropTypes.string
};

export default PlaylistItem;
