import React from 'react';

class RadioHeader extends React.Component {
  render() {
    const { isAdmin, radio } = this.props;
    let twitchLink;
    let theatreMode;
    let status = <span className="offline">offline</span>;

    if (radio.live) status = <span className="live">live</span>;
    if (radio.twitchChannel) {
      twitchLink = <a href={`http://www.twitch.tv/${radio.twitchChannel}`} className="left twitch" target="_blank"><img src="/twitch.png" alt="Twitch channel" /></a>;
    }
    if (isAdmin) {
      theatreMode = (
        <div className="mode">
          <a href="#" data-action="switch-mode" className="tooltipped" data-position="left" data-tooltip="Theatre mode">
            <i className="material-icons">aspect_ratio</i>
          </a>
        </div>
      );
    }

    return (
      <div className="row">
        <div className="col s12 m10">
          <h1>
            {twitchLink}
            {radio.name} <span className="theatre-only">| collaborate on <strong>http://ambiant.io/{radio.url}</strong></span>
          </h1>
        </div>
        <div className="col s12 m2 status left-align">
          {theatreMode}
          Status: {status}
        </div>
      </div>
    );
  }
}

RadioHeader.propTypes = {
  isAdmin: React.PropTypes.bool,
  radio: React.PropTypes.object
};

export default RadioHeader;
