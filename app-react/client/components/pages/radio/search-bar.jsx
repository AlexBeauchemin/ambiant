import React from 'react';
import SearchResults from './search-results.jsx';
import Loader from '../../shared/loader.jsx';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loading: false };

    this.input = { value: '' };
    _.bindAll(this, ['addSong', 'setInput']);
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
  
  render() {
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
            <input name="search-domain" type="radio" id="search-domain-youtube" value="youtube" checked />
            <label htmlFor="search-domain-youtube"><img src="/youtube.png" alt="Youtube" /></label>
            <input name="search-domain" type="radio" id="search-domain-soundcloud" value="soundcloud" />
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

export default SearchBar;
