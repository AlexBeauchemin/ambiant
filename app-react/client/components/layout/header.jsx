import React from 'react';
import Menu from './header/menu.jsx';
import MenuMobile from './header/menu-mobile.jsx';
import StaticAlerts from './header/static-alerts.jsx';

export default () => (
  <header className="navbar-fixed">
    <nav>
      <div className="nav-wrapper container">
        <a href="/" className="brand-logo">Ambiant<span>.io</span></a>
        <a href="#" data-activates="mobile-menu" className="button-collapse"><i className="material-icons">menu</i></a>
        <Menu />
        <MenuMobile />
      </div>
      <StaticAlerts />
    </nav>
  </header>
);