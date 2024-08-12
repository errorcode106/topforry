import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const SongManager = ({ songs, setSongs }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [songFile, setSongFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);

    const handleAddSong = () => {
        if (currentSong && songFile) {
            if (editingIndex !== null) {
                const updatedSongs = [...songs];
                updatedSongs[editingIndex] = { ...currentSong, songFile };
                setSongs(updatedSongs);
            } else {
                setSongs([...songs, { ...currentSong, songFile }]);
            }
            resetForm();
        }
    };

    const handleEditSong = (index) => {
        const songToEdit = songs[index];
        setCurrentSong(songToEdit);
        setSongFile(songToEdit.songFile);
        setEditingIndex(index);
        setShowModal(true);
    };

    const handleDeleteSong = (index) => {
        setSongs(songs.filter((_, i) => i !== index));
    };

    const resetForm = () => {
        setCurrentSong(null);
        setSongFile(null);
        setShowModal(false);
        setEditingIndex(null);
    };

    return (
        <>
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

            <div className="mb-3">
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Añadir Canción
                </Button>
            </div>

            <Modal show={showModal} onHide={resetForm}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingIndex !== null ? 'Editar Canción' : 'Añadir Canción'}</Modal.Title>
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
                    <Button variant="secondary" onClick={resetForm}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleAddSong}>
                        Guardar Canción
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SongManager;
