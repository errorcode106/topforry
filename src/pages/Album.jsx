import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [songToDelete, setSongToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedSong, setEditedSong] = useState(null);

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
                setCurrentSong(songsData.results[0] || null);

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
        setPlaying(false);
        setTimeout(() => setPlaying(true), 100);
    };

    const handleEditAlbum = () => {
        setEditing(!editing);
    };

    const handleSaveAlbumChanges = async () => {
        const authToken = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('title', albumData.title);
        formData.append('year', albumData.year);
        formData.append('artist', albumData.artist);
        if (albumData.cover instanceof File) {
            formData.append('cover', albumData.cover);
        }

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${albumData.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el álbum.');
            }

            const updatedAlbum = await response.json();
            setAlbumData(updatedAlbum);
            setEditing(false);
        } catch (err) {
            console.error('Error al actualizar el álbum:', err);
        }
    };

    const handleDeleteSong = (songId) => {
        setSongToDelete(songId);
        setShowDeleteModal(true);
    };

    const confirmDeleteSong = async () => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${songToDelete}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setSongs(songs.filter(song => song.id !== songToDelete));
                setShowDeleteModal(false);
            } else {
                console.error('Error al eliminar la canción:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar la canción:', error);
        }
    };

    const handleEditSong = (song) => {
        setEditedSong(song);
        setShowEditModal(true);
    };

    const handleSaveSongChanges = async () => {
        const authToken = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('title', editedSong.title);
        formData.append('year', editedSong.year);

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${editedSong.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Token ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la canción.');
            }

            const updatedSong = await response.json();
            setSongs(songs.map(song => song.id === updatedSong.id ? updatedSong : song));
            setShowEditModal(false);
        } catch (err) {
            console.error('Error al actualizar la canción:', err);
        }
    };

    useEffect(() => {
        const audioPlayer = document.getElementById('audio-player');
        if (audioPlayer) {
            if (playing && currentSong && currentSong.song_file) {
                audioPlayer.currentTime = 0;
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
                        songFile={currentSong?.song_file ? currentSong.song_file.replace("http://", "https://") : null}
                        coverImage={albumData.cover ? albumData.cover.replace("http://", "https://") : null}
                        title={currentSong?.title || 'No song selected'}
                        artist={albumData.artist}
                        playing={playing}
                        setPlaying={setPlaying}
                    />
                </div>
                <div className="col-md-8">
                    <div className="d-flex align-items-center">
                        {editing ? (
                            <>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={albumData.title}
                                    onChange={(e) => setAlbumData({ ...albumData, title: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="form-control ms-2"
                                    value={albumData.year}
                                    onChange={(e) => setAlbumData({ ...albumData, year: e.target.value })}
                                />
                                <input
                                    type="file"
                                    className="form-control ms-2"
                                    onChange={(e) => setAlbumData({ ...albumData, cover: e.target.files[0] })}
                                />
                                <Button className="ms-2" onClick={handleSaveAlbumChanges}>Guardar</Button>
                            </>
                        ) : (
                            <>
                                <h2>{albumData.title} <span className="text-muted">#{albumData.year}:{albumData.owner}</span></h2>
                                {authUser === albumData.owner && (
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        className="ms-auto"
                                        style={{ cursor: 'pointer', color: '#007bff' }}
                                        onClick={handleEditAlbum}
                                    />
                                )}
                            </>
                        )}
                    </div>
                    <div className="mt-4 mb-4"></div>
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
                                        <>
                                            <FontAwesomeIcon
                                                icon={faPen}
                                                className="text-primary me-3"
                                                style={{ cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditSong(song);
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="text-danger"
                                                style={{ cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSong(song.id);
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Modal para confirmar eliminación de canción */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar esta canción?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDeleteSong}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar canción */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Canción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSongTitle">
                            <Form.Label>Título</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedSong?.title || ''}
                                onChange={(e) => setEditedSong({ ...editedSong, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSongYear" className="mt-3">
                            <Form.Label>Año</Form.Label>
                            <Form.Control
                                type="number"
                                value={editedSong?.year || ''}
                                onChange={(e) => setEditedSong({ ...editedSong, year: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSaveSongChanges}>Guardar cambios</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AlbumDetail;
