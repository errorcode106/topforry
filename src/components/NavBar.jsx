import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="https://www.edesa.com.ar/wp-content/uploads/2023/11/Edesa-blanco.png"
            alt="Logo"
            height="32"
          />
        </a>
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
            <li className="nav-item">
              <a className="nav-link text-light" href="#">Inicio</a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-light"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Recursos
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="#">Álbumes</a></li>
                <li><a className="dropdown-item" href="#">Canciones</a></li>
                <li><a className="dropdown-item" href="#">Artistas</a></li>
                <li><a className="dropdown-item" href="#">Géneros</a></li>
              </ul>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="btn btn-dark me-2" href="#">Lista de Reproducción</a>
            </li>
            <li className="nav-item">
              <a className="btn btn-danger" href="#">Iniciar Sesión</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
