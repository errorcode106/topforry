import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';

const CreateAlbum = () => {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [artist, setArtist] = useState('');
    const [cover, setCover] = useState(null);
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [artistsList, setArtistsList] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [songFile, setSongFile] = useState(null);

    useEffect(() => {
        // Fetching list of artists
        const fetchArtists = async () => {
            const authToken = localStorage.getItem('authToken');
            try {
                const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/artists/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`,
                    },
                });
                const data = await response.json();
                setArtistsList(data.results);
            } catch (err) {
                console.error('Error fetching artists:', err);
            }
        };
        fetchArtists();
    }, []);

    const handleAddSong = () => {
        if (currentSong && songFile) {
            setSongs([...songs, { ...currentSong, songFile }]);
            setCurrentSong(null);
            setSongFile(null);
            setShowModal(false);
        }
    };

    const handleEditSong = (index) => {
        const songToEdit = songs[index];
        setCurrentSong(songToEdit);
        setSongs(songs.filter((_, i) => i !== index));
        setShowModal(true);
    };

    const handleDeleteSong = (index) => {
        setSongs(songs.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const authToken = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('year', year);
        formData.append('artist', artist);
        if (cover) {
            formData.append('cover', cover);
        }

        try {
            const response = await fetch('https://sandbox.academiadevelopers.com/harmonyhub/albums/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${authToken}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Error al crear el álbum.');
            }

            const albumData = await response.json();
            setSuccess('Álbum creado con éxito!');
            setError(null);
            setTitle('');
            setYear('');
            setArtist('');
            setCover(null);

            // Add each song to the album
            songs.forEach(async (song) => {
                const songFormData = new FormData();
                songFormData.append('title', song.title);
                songFormData.append('year', song.year);
                songFormData.append('album', albumData.id);
                songFormData.append('song_file', song.songFile);

                try {
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
                } catch (err) {
                    console.error('Error al añadir la canción:', err);
                }
            });
        } catch (err) {
            setError(err.message);
            setSuccess(null);
        }
    };

    return (
        <div className="container my-5">
            <h2>Crear Nuevo Álbum</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Título</label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Año</label>
                    <input
                        type="number"
                        className="form-control"
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        placeholder="YYYY"
                        min="1900"
                        max={new Date().getFullYear()}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="artist" className="form-label">Artista</label>
                    <select
                        className="form-select"
                        id="artist"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un artista...</option>
                        {artistsList.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                                {artist.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="cover" className="form-label">Portada</label>
                    <input
                        type="file"
                        className="form-control"
                        id="cover"
                        onChange={(e) => setCover(e.target.files[0])}
                    />
                </div>

                {/* Lista de canciones añadidas */}
                <div className="mb-3">
                    <h4>Canciones Añadidas</h4>
                    {songs.length === 0 ? (
                        <p>No hay canciones añadidas.</p>
                    ) : (
                        <ul className="list-group">
                            {songs.map((song, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{song.title}</strong> - {song.year}
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-sm btn-warning me-2" onClick={() => handleEditSong(index)}>Editar</button>
                                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteSong(index)}>Borrar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Botón para añadir canción */}
                <div className="mb-3">
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Añadir Canción
                    </Button>
                </div>

                <button type="submit" className="btn btn-primary">Crear Álbum</button>
            </form>

            {/* Modal para añadir canción */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Canción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="songTitle" className="form-label">Título de la Canción</label>
                        <input
                            type="text"
                            className="form-control"
                            id="songTitle"
                            value={currentSong?.title || ''}
                            onChange={(e) => setCurrentSong({ ...currentSong, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="songYear" className="form-label">Año de Lanzamiento</label>
                        <input
                            type="number"
                            className="form-control"
                            id="songYear"
                            value={currentSong?.year || ''}
                            onChange={(e) => setCurrentSong({ ...currentSong, year: e.target.value })}
                            placeholder="YYYY"
                            min="1900"
                            max={new Date().getFullYear()}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="songFile" className="form-label">Archivo de la Canción</label>
                        <input
                            type="file"
                            className="form-control"
                            id="songFile"
                            onChange={(e) => setSongFile(e.target.files[0])}
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddSong}>
                        Guardar Canción
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateAlbum;
