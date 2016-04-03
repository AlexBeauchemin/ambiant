import React from 'react';
import { map } from 'lodash';

class SearchResults extends React.Component {
  render() {
    const { data } = this.props;

    return (
      <div id="search-result" className="collection">
        { map(data, (item) => {
          return (
            <a key={item.id} href="#" className="collection-item" data-action="select">
              {item.title}
              <span className="btn btn-flat" data-action="add">+</span>
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
