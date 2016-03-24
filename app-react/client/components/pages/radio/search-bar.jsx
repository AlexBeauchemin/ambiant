import React from 'react';
import { connect } from 'react-redux';
import { setDomain, setIsSearching, setSearchResults } from '../../../actions/search-actions';
import { bindAll } from 'lodash';
import SearchResults from './search-results.jsx';
import Loader from '../../shared/loader.jsx';

let searchTimeout = null;

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.input = { value: '' };
    bindAll(this, ['addSong', 'onKeyUp', 'setInput', 'toggleDomain']);
  }

  addSong(e) {
    const { dispatch } = this.props;
    const val = this.input.value.trim();

    if (e) e.preventDefault();
    if (!val) return;

    dispatch(setIsSearching(true));
  }

  handleUpKey() {

  }

  handleDownKey() {

  }

  onKeyUp(e) {
    const { dispatch } = this.props;

    dispatch(setIsSearching(false));

    if (e.charCode === 13) {
      e.preventDefault();
      // TODO: If not a song, trigger a search instead
      return this.addSong();
    }

    this.search(e.keyCode);
  }

  search(key) {
    const { dispatch } = this.props;

    if (searchTimeout) clearTimeout(searchTimeout);

    switch (key) {
      case 40:
        return this.handleDownKey();
      case 38:
        return this.handleUpKey();
    }

    this.startSearch();
  }

  setInput(node) {
    this.input = node;
  }

  startSearch() {
    const { dispatch } = this.props;
    const q = this.input.value;

    dispatch(setSearchResults([]));

    if (q.length < 3 ||
      q.indexOf('http://') === 0 ||
      q.indexOf('https://') === 0 ||
      q.indexOf('www.') === 0 ||
      q.indexOf('soundcloud.') === 0 ||
      q.indexOf('youtube.') === 0 ||
      q.indexOf('youtu.be/') === 0) {
      return;
    }

    dispatch(setIsSearching(true));

    searchTimeout = setTimeout(() => {
      console.log('search');
      dispatch(setIsSearching(false));
      // App[domain].search(q, (res) => {
      //   Session.set('isSearching', false);
      //   if (!_.isEmpty(res)) Session.set('search-result', res);
      // });
    }, 1000);
  }

  toggleDomain(e) {
    const { dispatch } = this.props;
    const domain = e.target.value;

    dispatch(setDomain(domain));
  }

  render() {
    const { search = {} } = this.props;
    const domainClass = search.isSearching ? 'hidden' : '';

    return (
      <form className="row control-add" onSubmit={ this.addSong }>
        <div className="col s12 m8 search">
          <div className="input-field">
            <input type="text" name="add-song" id="add-song" autoComplete="off" ref={ this.setInput } onKeyUp={ this.onKeyUp } />
            <label htmlFor="add-song">Search song or enter url</label>
            <i className="material-icons">search</i>
            <Loader visible={ search.isSearching } />
            <SearchResults />
          </div>
          <div className={`input-field search-domain ${domainClass}`}>
            <input name="search-domain" type="radio" id="search-domain-youtube" value="youtube" onClick={this.toggleDomain} checked={search.domain === 'youtube'} />
            <label htmlFor="search-domain-youtube"><img src="/youtube.png" alt="Youtube" /></label>
            <input name="search-domain" type="radio" id="search-domain-soundcloud" value="soundcloud" onClick={this.toggleDomain} checked={search.domain === 'soundcloud'} />
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
  search: React.PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    search: state.search
  };
};

export default connect(mapStateToProps)(SearchBar);
