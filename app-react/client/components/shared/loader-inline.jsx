import React from 'react';
import classNames from 'classnames';

class Loader extends React.Component {
  render() {
    const { noMargin, hidden } = this.props;
    return (
      <div className={ classNames('progress', { noMargin, hidden }) }>
        <div className="indeterminate"></div>
      </div>
    );
  }
}

Loader.propTypes = {
  noMargin: React.PropTypes.bool,
  hidden: React.PropTypes.bool
};

export default Loader;
