import React from 'react';
import { connect } from 'react-redux';
import { setDomain } from '../../../actions/search-actions';
import { bindAll } from 'lodash';
import SearchResults from './search-results.jsx';
import Loader from '../../shared/loader.jsx';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.input = { value: '' };
    bindAll(this, ['addSong', 'setInput', 'toggleDomain']);
  }

  addSong(e) {
    const val = this.input.value.trim();

    e.preventDefault();
    if (!val) return;
    this.setState({ loading: true });
  }

  setInput(node) {
    this.input = node;
  }

  toggleDomain(e) {
    const { dispatch } = this.props;
    const domain = e.target.value;

    dispatch(setDomain(domain));
  }

  render() {
    const { searchDomain } = this.props;
    const isLoading = this.state.loading;
    const domainClass = isLoading ? 'hidden' : '';
    
    return (
      <form className="row control-add" onSubmit={ this.addSong }>
        <div className="col s12 m8 search">
          <div className="input-field">
            <input type="text" name="add-song" id="add-song" autoComplete="off" ref={ this.setInput } data-action="search" />
            <label htmlFor="add-song">Search song or enter url</label>
            <i className="material-icons">search</i>
            <Loader visible={ isLoading } />
            <SearchResults />
          </div>
          <div className={`input-field search-domain ${domainClass}`}>
            <input name="search-domain" type="radio" id="search-domain-youtube" value="youtube" onClick={this.toggleDomain} checked={searchDomain === 'youtube'} />
            <label htmlFor="search-domain-youtube"><img src="/youtube.png" alt="Youtube" /></label>
            <input name="search-domain" type="radio" id="search-domain-soundcloud" value="soundcloud" onClick={this.toggleDomain} checked={searchDomain === 'soundcloud'} />
            <label htmlFor="search-domain-soundcloud"><img src="/soundcloud.png" alt="Soundcloud" /></label>
          </div>
        </div>
        <div className="col s12 m4 align-right">
          <button type="submit" className="btn waves-effect waves-light">Add To Queue</button>
        </div>
      </form>
    );
  }
}

SearchBar.propTypes = {
  dispatch: React.PropTypes.func,
  searchDomain: React.PropTypes.string
};

const mapStateToProps = (state) => {
  return {
    searchDomain: state.searchDomain
  };
};

export default connect(mapStateToProps)(SearchBar);
