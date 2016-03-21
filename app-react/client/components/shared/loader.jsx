import React from 'react';

class Loader extends React.Component {
  render() {
    const { size = 'tiny', visible = true } = this.props;

    if (!visible) return null;

    return (
      <div className="center-align loading">
        <div className={`preloader-wrapper ${size} active`}>
          <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Loader.propTypes = {
  size: React.PropTypes.string,
  visible: React.PropTypes.bool
};

export default Loader;
