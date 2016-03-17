import React from 'react';
import RadioItem from './radio-item.jsx';

class RadioList extends React.Component {
  render() {
    const { radios } = this.props;

    return (
      <div className="radios-list col s12">
        {radios.map(radio => <RadioItem key={ radio._id } {...radio} />)}
      </div>
    );
  }
}

RadioList.propTypes = {
  radios: React.PropTypes.array
};

export default RadioList;
