import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPen, faTrash, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form } from 'react-bootstrap';
import AudioPlayer from '../components/AudioPlayer';
import SongManager from '../components/SongManager';

const AlbumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [albumData, setAlbumData] = useState(null);
    const [originalAlbumData, setOriginalAlbumData] = useState(null);
    const [songs, setSongs] = useState([]);
    const [originalSongs, setOriginalSongs] = useState([]);
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
    const [tempCoverImage, setTempCoverImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteAlbumModal, setShowDeleteAlbumModal] = useState(false);
    const [newSongs, setNewSongs] = useState([]);
    const [songsToDelete, setSongsToDelete] = useState([]);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const authToken = localStorage.getItem('authToken');

                const userResponse = await fetch(`https://sandbox.academiadevelopers.com/users/profiles/profile_data/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`,
                    },
                });

                const userData = await userResponse.json();
                setAuthUser(userData.user__id);

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
                setOriginalAlbumData(album);

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
                setOriginalSongs(songsData.results);
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
        if (!editing) {
            setOriginalAlbumData(albumData);
            setOriginalSongs([...songs]);
        }
        setEditing(!editing);
    };

    const handleSaveAlbumChanges = async () => {
        setIsSaving(true);
        const authToken = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('title', albumData.title);
        formData.append('year', albumData.year);
        formData.append('artist', albumData.artist);
        if (tempCoverImage instanceof File) {
            formData.append('cover', tempCoverImage);
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

            await Promise.all(newSongs.map(async (song) => {
                const songFormData = new FormData();
                songFormData.append('title', song.title);
                songFormData.append('year', song.year);
                songFormData.append('album', albumData.id);
                songFormData.append('song_file', song.songFile);

                const songResponse = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/songs/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    },
                    body: songFormData,
                });

                if (!songResponse.ok) {
                    throw new Error('Error al añadir la canción.');
                }
            }));

            await Promise.all(songsToDelete.map(async (songId) => {
                const deleteResponse = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/${songId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Token ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!deleteResponse.ok) {
                    console.error('Error al eliminar la canción:', deleteResponse.statusText);
                }
            }));

            const updatedSongsResponse = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/?album=${albumData.id}`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!updatedSongsResponse.ok) {
                throw new Error('Error al obtener las canciones actualizadas.');
            }

            const updatedSongsData = await updatedSongsResponse.json();
            setSongs(updatedSongsData.results);

            const updatedAlbum = await response.json();
            setAlbumData(updatedAlbum);
            setTempCoverImage(null);
            setEditing(false);
            setNewSongs([]);
            setSongsToDelete([]);
        } catch (err) {
            console.error('Error al actualizar el álbum:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSong = (songId) => {
        setSongs(songs.filter(song => song.id !== songId));
        setSongsToDelete([...songsToDelete, songId]);
        setSongToDelete(null);
        setShowDeleteModal(false);
    };

    const handleDeleteAlbum = () => {
        setShowDeleteAlbumModal(true);
    };

    const confirmDeleteAlbum = async () => {
        const authToken = localStorage.getItem('authToken');

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/albums/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setShowDeleteAlbumModal(false);
                navigate('/albums');
            } else {
                console.error('Error al eliminar el álbum:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar el álbum:', error);
        }
    };

    const handleEditSong = (song) => {
        setEditedSong(song);
        setShowEditModal(true);
    };

    const handleSaveSongChanges = () => {
        setSongs(songs.map(song => song.id === editedSong.id ? editedSong : song));
        setShowEditModal(false);
    };

    const handleCoverImageChange = (file, previewUrl) => {
        setTempCoverImage(file);
        setAlbumData({ ...albumData, cover: previewUrl });
    };

    const handleCancelEdit = () => {
        setAlbumData(originalAlbumData);
        setSongs(originalSongs);
        setNewSongs([]);
        setSongsToDelete([]);
        setTempCoverImage(null);
        setEditing(false);
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
                        isEditable={editing}
                        onCoverImageChange={handleCoverImageChange}
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
                                <FontAwesomeIcon
                                    icon={faSave}
                                    className="ms-2"
                                    size="lg"
                                    style={{ cursor: isSaving ? 'not-allowed' : 'pointer', color: isSaving ? '#ccc' : '#007bff' }}
                                    onClick={isSaving ? null : handleSaveAlbumChanges}
                                />
                                <FontAwesomeIcon
                                    icon={faTimesCircle}
                                    className="ms-2"
                                    size="lg"
                                    style={{ cursor: isSaving ? 'not-allowed' : 'pointer', color: isSaving ? '#ccc' : '#dc3545' }}
                                    onClick={isSaving ? null : handleCancelEdit}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="ms-2"
                                    size="lg"
                                    style={{ cursor: isSaving ? 'not-allowed' : 'pointer', color: isSaving ? '#ccc' : '#dc3545' }}
                                    onClick={isSaving ? null : handleDeleteAlbum}
                                />

                            </>
                        ) : (
                            <>
                                <h2>{albumData.title} <span className="text-muted">#{albumData.year}:{albumData.owner}</span></h2>
                                {authUser === albumData.owner && (
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        className="ms-auto"
                                        size="lg"
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
                                    {authUser === albumData.owner && editing && (
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
                                                    setSongToDelete(song.id);
                                                    setShowDeleteModal(true);
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {editing && (
                        <div className="mt-4">
                            <h4>Añadir Nuevas Canciones</h4>
                            <SongManager songs={newSongs} setSongs={setNewSongs} />
                        </div>
                    )}
                </div>
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar esta canción?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={() => handleDeleteSong(songToDelete)}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteAlbumModal} onHide={() => setShowDeleteAlbumModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar eliminación del álbum</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar este álbum y todas sus canciones?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteAlbumModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDeleteAlbum}>Eliminar Álbum</Button>
                </Modal.Footer>
            </Modal>

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
