import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SongManager from '../components/SongManager'

const CreateAlbum = () => {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [artist, setArtist] = useState('');
    const [cover, setCover] = useState(null);
    const [songs, setSongs] = useState([]);
    const [artistsList, setArtistsList] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
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

                <SongManager songs={songs} setSongs={setSongs} />

                <button type="submit" className="btn btn-primary">Crear Álbum</button>
            </form>
        </div>
    );
};

export default CreateAlbum;
