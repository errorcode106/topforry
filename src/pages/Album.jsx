import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const AlbumDetail = () => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');

        const albumResponse = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`,
          },
        });

        if (!albumResponse.ok) {
          throw new Error('Error al obtener los datos del álbum.');
        }

        const album = await albumResponse.json();
        setAlbumData(album);

        const songsResponse = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/?album=${id}`, {
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!songsResponse.ok) {
          throw new Error('Error al obtener las canciones del álbum.');
        }

        const songsData = await songsResponse.json();
        setSongs(songsData.results);
        setCurrentSong(songsData.results[0]); // Iniciar con la primera canción seleccionada

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAlbumData();
  }, [id]);

  const handleSongClick = (song) => {
    if (currentSong && currentSong.id === song.id && playing) {
      setPlaying(false);
    } else {
      setCurrentSong(song);
      setPlaying(true);
    }
  };

  useEffect(() => {
    const audioPlayer = document.getElementById('audio-player');
    if (audioPlayer) {
      if (playing && currentSong && currentSong.song_file) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  }, [playing, currentSong]);

  if (loading) {
    return <div className="text-center mt-5">Cargando álbum...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <img src={albumData.cover} alt={albumData.title} className="img-fluid rounded mb-4" />
          <div>
            <p><strong>Año:</strong> {albumData.year}</p>
            <p><strong>ID del Artista:</strong> {albumData.artist}</p>
            <p><strong>Propietario:</strong> {albumData.owner}</p>
          </div>
        </div>
        <div className="col-md-8">
          <h2>{albumData.title} <span className="text-muted">#{albumData.id}</span></h2>
          <div className="mt-4 mb-4">
            {currentSong && (
              <div>
                <h4>Reproduciendo: {currentSong.title}</h4>
                <audio id="audio-player" controls src={currentSong.song_file} className="w-100">
                  Tu navegador no soporta el elemento de audio.
                </audio>
                <p>Duración: {currentSong.duration ? `${currentSong.duration} segundos` : 'No especificada'}</p>
                <p>Vistas: {currentSong.view_count}</p>
              </div>
            )}
          </div>
          <h4>Canciones</h4>
          <ul className="list-group">
            {songs.map((song, index) => (
              <li
                key={song.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${currentSong && currentSong.id === song.id ? 'active' : ''}`}
                onClick={() => handleSongClick(song)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={currentSong && currentSong.id === song.id && playing ? faPause : faPlay}
                    className="me-3"
                    style={{ color: currentSong && currentSong.id === song.id ? '#007bff' : '#6c757d' }}
                  />
                  <span>{index + 1}. </span>
                  <strong className="ms-2">{song.title}</strong>
                </div>
                <span className="text-muted">{song.duration ? `${song.duration} s` : 'No especificada'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetail;
