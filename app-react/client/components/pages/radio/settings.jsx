import React from 'react';

class Settings extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <p>Settings</p>
    );
  }
}

Settings.propTypes = {
  data: React.PropTypes.array
};

export default Settings;
