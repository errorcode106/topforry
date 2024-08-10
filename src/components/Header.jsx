import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './NavBar';
import './Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  const navItems = [
    { text: 'Inicio', href: '/' },
    {
      text: 'Canciones',
      dropdown: true,
      requiresAuth: true,
      dropdownItems: [
        { text: "Escuchar Canción", url: "/canciones/list" },
        { text: "Subir Canción", url: "/canciones/create" },
        { text: "Modificar Canción", url: "/canciones/update" },
        { text: "Borrar Canción", url: "/canciones/delete" },
      ],
    },
  ];

  const buttonLinks = [
    { text: 'Lista de Reproducción', href: '#', className: 'btn-dark', requiresAuth: true },
  ];

  return (
    <header className="masthead position-relative">
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
        <div className="masthead-text">
         
          
        </div>
      </div>
    </header>
  );
};

export default Header;
