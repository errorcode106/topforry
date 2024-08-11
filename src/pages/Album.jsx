import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import AudioPlayer from '../components/AudioPlayer';

const AlbumDetail = () => {
    const { id } = useParams();
    const [albumData, setAlbumData] = useState(null);
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                // Fetch user info
                const userResponse = await fetch(`https://sandbox.academiadevelopers.com/users/profiles/profile_data/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`,
                    },
                });

                const userData = await userResponse.json();
                setAuthUser(userData.user__id);

                // Fetch album data
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
                setCurrentSong(songsData.results[0] || null); // Iniciar con la primera canción seleccionada o null si no hay canciones

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAlbumData();
    }, [id]);

    const handleSongClick = (song) => {
        setCurrentSong(song);
        setPlaying(false);  // Parar la reproducción actual
        setTimeout(() => setPlaying(true), 100);  // Iniciar la reproducción de la nueva canción
    };

    const handleEditAlbum = () => {
        setEditing(!editing);
    };

    const handleDeleteSong = async (songId) => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${songId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setSongs(songs.filter(song => song.id !== songId));
            } else {
                console.error('Error al eliminar la canción:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar la canción:', error);
        }
    };

    useEffect(() => {
        const audioPlayer = document.getElementById('audio-player');
        if (audioPlayer) {
            if (playing && currentSong && currentSong.song_file) {
                audioPlayer.currentTime = 0;  // Reinicia la canción
                audioPlayer.play();
            } else {
                audioPlayer.pause();
            }
        }
    }, [playing, currentSong]);

    if (loading) {
        return (
            <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body d-flex justify-content-center align-items-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return <div className="alert alert-danger mt-5 text-center">{error}</div>;
    }

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-4">
                    <AudioPlayer
                        songFile={currentSong?.song_file || null}  // Asegurarse de pasar null si no hay canción
                        coverImage={albumData.cover}
                        title={currentSong?.title || 'No song selected'}
                        artist={albumData.artist}
                        playing={playing}
                        setPlaying={setPlaying}
                    />
                    <div>
                        <p></p>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="d-flex align-items-center">
                        <h2>{albumData.title} <span className="text-muted">#{albumData.year}:{albumData.owner}</span></h2>
                        {authUser === albumData.owner && (
                            <FontAwesomeIcon
                                icon={faPen}
                                className="ms-auto"
                                style={{ cursor: 'pointer', color: '#007bff' }}
                                onClick={handleEditAlbum}
                            />
                        )}
                    </div>
                    <div className="mt-4 mb-4">

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
                                <div className="d-flex align-items-center">
                                    <span className="text-muted me-3">{song.duration ? `${song.duration} s` : 'No especificada'}</span>
                                    {authUser === albumData.owner && (
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="text-danger"
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSong(song.id);
                                            }}
                                        />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AlbumDetail;
