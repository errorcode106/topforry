import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './NavBar';
import './Header.css'; // Asumimos que tienes un archivo CSS para los estilos específicos del header

const Header = () => {
  return (
    <header className="masthead position-relative">
      <div className="container-fluid fixed-top">
        <div className="row align-items-center py-2" style={{ background: 'rgba(92, 88, 220, 0.75)', backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>
          <div className="col">
            <Navbar />
          </div>
        </div>
      </div>
      <div className="overlay-header"></div>
      <div className="container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="masthead-text">
          <h1>Álbumes</h1>
          <p className="fs-4">Aquí encontrarás la lista de todos los álbumes.</p>
        </div>
      </div>
    </header>
  );
};

export default Header;