import React, { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Importa Link
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ logoSrc, logoAlt, navItems, buttonLinks }) => {
  const { state, actions } = useContext(AuthContext);
  const { isAuthenticated } = state;
  const { logout } = actions;

  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No se encontró el authToken');
      return;
    }

    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/users/profiles/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      if (response.ok) {
        logout();
      } else {
        console.error('Error al cerrar sesión:', response.statusText);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
          <img src={logoSrc} alt={logoAlt} height="32" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {navItems.map((item, index) => (
              item.requiresAuth && !isAuthenticated ? null : (
                item.dropdown ? (
                  <li key={index} className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle text-light"
                      to="#"
                      id={`navbarDropdown${index}`}
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {item.text}
                    </Link>
                    <ul className="dropdown-menu" aria-labelledby={`navbarDropdown${index}`}>
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <li key={idx}>
                          <Link className="dropdown-item" to={dropdownItem.url}>
                            {dropdownItem.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={index} className="nav-item">
                    <Link className="nav-link text-light" to={item.href}>{item.text}</Link>
                  </li>
                )
              )
            ))}
          </ul>
          <ul className="navbar-nav">
            {buttonLinks.map((button, index) => (
              button.requiresAuth && !isAuthenticated ? null : (
                <li key={index} className="nav-item">
                  <Link
                    className={`btn ${button.className} me-2`}
                    to={button.href}
                    onClick={button.onClick}
                  >
                    {button.text}
                  </Link>
                </li>
              )
            ))}
            <li className="nav-item">
              <button
                className="btn btn-danger"
                onClick={isAuthenticated ? handleLogout : handleLogin}
              >
                {isAuthenticated ? "Cerrar Sesión" : "Iniciar Sesión"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
