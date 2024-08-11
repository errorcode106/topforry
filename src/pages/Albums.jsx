import React, { useState, useEffect } from 'react';
import MusicCard from "../components/MusicCard";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Albums() {
    const [albums, setAlbums] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlbums = async () => {
            const authToken = localStorage.getItem('authToken');
            let url = 'https://sandbox.academiadevelopers.com/harmonyhub/albums/';

            if (searchTitle) {
                url += `?title=${searchTitle}`;
            }

            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${authToken}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los álbumes.');
                }

                const data = await response.json();
                setAlbums(data.results);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAlbums();
    }, [searchTitle]);

    const handleSearchChange = (e) => {
        setSearchTitle(e.target.value);
    };

    if (loading) {
        return <div className="text-center mt-5">Cargando álbumes...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5 text-center">{error}</div>;
    }

    return (
        <div className="container my-5">
            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por título de álbum"
                    value={searchTitle}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="row">
                {albums.length > 0 ? (
                    albums.map(album => (
                        <div key={album.id} className="col-md-4">
                            <MusicCard
                                title={album.title}
                                text={album.artist}
                                year={`${album.year}`}
                                imageUrl={album.cover}
                                albumId={album.id}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No se encontraron álbumes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
