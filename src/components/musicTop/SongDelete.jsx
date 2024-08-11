import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import SongCard from "./SongCard";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function SongDelete() {
    const { token } = useAuth("state");
    const [page, setPage] = useState(1);
    const [songs, setSongs] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [noResults, setNoResults] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const observerRef = useRef();
    const lastSongElementRef = useRef();

    const doFetch = async () => {
        setIsLoading(true);
        let query = new URLSearchParams({
            page: page,
            page_size: 5,
            ordering: `-created_at`,
            ...filters,
        }).toString();

        fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/?${query}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.results && data.results.length > 0) {
                    setSongs((prevSongs) => [...prevSongs, ...data.results]);
                    setNextUrl(data.next);
                    setNoResults(false);
                } else if (page === 1) {
                    setNoResults(true);
                }
            })
            .catch(() => {
                setIsError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        doFetch();
    }, [page, filters]);

    useEffect(() => {
        if (isLoading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((cards) => {
            if (cards[0].isIntersecting && nextUrl) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (lastSongElementRef.current) {
            observerRef.current.observe(lastSongElementRef.current);
        }
    }, [isLoading, nextUrl]);

    function handleSearch(event) {
        event.preventDefault();

        const searchForm = new FormData(event.target);
        const newFilters = {};

        searchForm.forEach((value, key) => {
            if (value) {
                newFilters[key] = value;
            }
        });

        setFilters(newFilters);
        setSongs([]);
        setPage(1);
    }

    const handleDeleteSong = (song) => {
        setSelectedSong(song);
        setShowModal(true);
        console.log('Showing modal:', song); 
    };

    const confirmDelete = () => {
        fetch(
            `https://sandbox.academiadevelopers.com/harmonyhub/songs/${selectedSong.id}/`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        )
            .then((response) => {
                if (response.ok) {
                    setSongs((prevSongs) =>
                        prevSongs.filter((song) => song.id !== selectedSong.id)
                    );
                    setSelectedSong(null);
                    setShowModal(false);
                } else {
                    console.error("Failed to delete song");
                }
            })
            .catch((error) => console.error("Error:", error));
    };

    if (isError) return <p>Error al cargar las canciones.</p>;

    return (
        <div className="container my-5">
            <h2 className="mb-4">Busca y elimina la canción</h2>
            <form className="mb-4" onSubmit={handleSearch}>
                <div className="mb-3">
                    <label className="form-label">Ingrese el nombre:</label>
                    <input className="form-control" type="text" name="title" />
                </div>
                <button className="btn btn-primary" type="submit">
                    Buscar
                </button>
            </form>

            {noResults && (
                <div className="alert alert-warning" role="alert">
                    No se encontró la canción.
                </div>
            )}

            <div className="row">
                {songs.map((song, index) => (
                    <div
                        key={song.id}
                        ref={songs.length === index + 1 ? lastSongElementRef : null}
                        className="col-lg-4 mb-3"
                    >
                        <SongCard song={song} />
                        <button
                            className="btn btn-danger mt-3"
                            onClick={() => handleDeleteSong(song)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
            {isLoading && <p>Cargando más canciones...</p>}

            {/* Modal de Bootstrap */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Canción</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    onClick={() => setShowModal(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <p>
                                    ¿Estás seguro de que deseas eliminar la canción "{selectedSong?.title}"?
                                    No se podrá recuperar este recurso.
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmDelete}
                                >
                                    Confirmar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SongDelete;
