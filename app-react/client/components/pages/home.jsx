import React from 'react';
import RadioCreate from './home/radio-create.jsx';
import RadioList from './home/radio-list.jsx';

class Home extends React.Component {
  render() {
    const { radio } = this.props;
    let btn = <a href="#modal-create-radio" className="btn btn-large waves-effect waves-light">Create your radio</a>;

    if (radio) btn = <a href="#modal-create-radio" className="btn btn-large waves-effect waves-light">Create your radio</a>;

    return (
      <div className="container">
        <h1 className="center-align">A simple collaborative music radio for live streams, working space, partys or
          events</h1>

        <div className="row">
          <div className="col s12">
            <ul className="tabs z-depth-1">
              <li className="tab col s3"><a href="#info">Info</a></li>
              <li className="tab col s3"><a href="#top-radios">Popular</a></li>
              <li className="tab col s3"><a href="#recent-radios">Recent</a></li>
              <li className="tab col s3"><a href="#twitch-radios">Twitch</a></li>
            </ul>
          </div>
          <div id="info" className="col s12">
            <div className="card space-top z-depth-1">
              <ul>
                <li>Start a radio by choosing a name and hit the "create" button</li>
                <li>Add songs that you like to the playlist</li>
                <li>Invite people to add their favorite songs by sharing your unique url</li>
                <li>That's it, your radio is now ready!</li>
              </ul>
              <p className="space-top">The radio will continue playing related songs when your playlist ends. If you are
                a <a href="http://www.twitch.com" target="_blank">Twitch</a> streamer, login in with Twitch and let your
                viewers, followers or subscribers decide what will play next.</p>
            </div>

            <p className="space-top-big center-align">
              { btn }
            </p>
          </div>

          <RadioCreate />
          <RadioList />

        </div>
      </div>
    );
  }
}

Home.propTypes = {
  radio: React.PropTypes.object
};

export default Home;
