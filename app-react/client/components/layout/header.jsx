import React, { PropTypes } from 'react';
import Menu from './header/menu.jsx';
import MenuMobile from './header/menu-mobile.jsx';
import StaticAlerts from './header/static-alerts.jsx';

const Header = (props) => {
  const { radio = {}, user, page, slug } = props;
  const isOwnRadio = radio ? slug === radio.url : false;
  
  return (
    <header className="navbar-fixed">
      <nav>
        <div className="nav-wrapper container">
          <a href="/" className="brand-logo">Ambiant<span className="small">.io</span></a>
          <a href="#" data-activates="mobile-menu" className="button-collapse">
            <i className="material-icons">menu</i>
          </a>
          <Menu radio={radio} user={user} page={page} isOwnRadio={isOwnRadio} />
          <MenuMobile radio={radio} user={user} page={page} />
        </div>
        <StaticAlerts />
      </nav>
    </header>
  );
};

Header.propTypes = {
  page: PropTypes.string,
  radio: PropTypes.object,
  slug: PropTypes.string,
  user: PropTypes.object
};

export default Header;
