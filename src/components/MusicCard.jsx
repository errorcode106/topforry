import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MusicCard.css";
const MusicCard = ({ title, text, year, imageUrl, albumId }) => {
  return (
    <div className="col d-flex justify-content-center align-items-center">
      <div className="my-4 p-0 card music-card" style={{ width: "18rem" }}>
        <div className="card-img-wrapper">
          <img
            src={imageUrl}
            className="card-img-top"
            alt={text}
          />
          <div className="overlay">
            <Link to={`/albums/id/${albumId}`} className="play-button">
              <FontAwesomeIcon icon={faPlay} />
            </Link>
          </div>
        </div>
        <div className="card-body text-center">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
          <p className="card-text">{year}</p>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
