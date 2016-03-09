import React from 'react';
import Menu from './header/menu.jsx';
import MenuMobile from './header/menu-mobile.jsx';
import StaticAlerts from './header/static-alerts.jsx';

class Header extends React.Component {
  render() {
    const { radio, user } = this.props;

    return (
      <header className="navbar-fixed">
        <nav>
          <div className="nav-wrapper container">
            <a href="/" className="brand-logo">Ambiant<span className="small">.io</span></a>
            <a href="#" data-activates="mobile-menu" className="button-collapse">
              <i className="material-icons">menu</i>
            </a>
            <Menu radio={radio} user={user} />
            <MenuMobile radio={radio} user={user} />
          </div>
          <StaticAlerts />
        </nav>
      </header>
    );
  }
}

Header.propTypes = {
  radio: React.PropTypes.object,
  user: React.PropTypes.object
};

export default Header;
