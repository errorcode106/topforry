import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faReddit, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = ({
  menuItems,
  languages,
  selectedLanguage,
  onLanguageChange,
  logoSrc,
  siteName,
  tagline,
  socialLinks,
  year,
  copyrightText,
}) => {
  return (
    <footer className="footer text-white py-4" style={{ backgroundColor: '#4341B2' }}>
      <div className="container">
        <div className="row border-bottom pb-3">
          <div className="col d-flex align-items-center">
            <nav className="nav">
              {menuItems.map((item, index) => (
                <a key={index} className="nav-link text-white" href={item.href}>
                  {item.text}
                </a>
              ))}
            </nav>
          </div>
          <div className="col-auto">
            <select
              className="form-select bg-dark text-white border-0"
              aria-label="Language select"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {languages.map((language, index) => (
                <option key={index} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row pt-3">
          <div className="col">
            <div className="row">
              <div className="col-auto">
                <div className="row flex-nowrap">
                  <div className="col-auto">
                    <img src={logoSrc} alt="Logo" width="75" height="75" />
                  </div>
                  <div className="col">
                    <h1 className="fs-3">{siteName}</h1>
                    <span className="fs-5">{tagline}</span>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="row">
                  <div className="col-12">@{year} {siteName}</div>
                  <div className="col-12">{copyrightText}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto text-end">
            <div className="social-icons mt-2">
              {socialLinks.map((link, index) => (
                <a key={index} href={link.href} className="text-white me-2">
                  <FontAwesomeIcon icon={link.icon} className="fs-3" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
