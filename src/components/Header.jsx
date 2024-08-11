import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './NavBar';
import './Header.css';

const Header = ({ isLoggedIn, onLogout, title, subtitle, backgroundClass }) => {
  const navItems = [
    { text: 'Inicio', href: '/' },
    {
      text: 'Recursos',
      dropdown: true,
      requiresAuth: true,
      dropdownItems: [
        { text: 'Álbumes', href: '/albums' },
        { text: 'Canciones', href: '/songs' },
        { text: 'Artistas', href: '#' },
        { text: 'Géneros', href: '#' },
      ],
    },
  ];

  const buttonLinks = [
    { text: 'Lista de Reproducción', href: '#', className: 'btn-dark', requiresAuth: true },
  ];

  return (
    <header className={`masthead position-relative ${backgroundClass}`}>
      <div className="container-fluid fixed-top">
        <div className="row align-items-center py-2" style={{ background: 'rgba(92, 88, 220, 0.75)', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
          <div className="col">
            <Navbar
              logoSrc="https://www.edesa.com.ar/wp-content/uploads/2023/11/Edesa-blanco.png"
              logoAlt="Logo"
              navItems={navItems}
              buttonLinks={buttonLinks}
              isLoggedIn={isLoggedIn}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
      <div className="overlay-header"></div>
      <div className="container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="masthead-text text-center">
          <h1>{title}</h1>
          <p className="fs-4">{subtitle}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
