import React, { useEffect, useState, useRef } from "react";
import SongCard from "./SongCard";

function SongList() {
    const [page, setPage] = useState(1);
    const [songs, setSongs] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [noResults, setNoResults] = useState(false); 

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

        fetch(
            `https://sandbox.academiadevelopers.com/harmonyhub/songs/?${query}`,
            {}
        )
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

    if (isError) return <p>Error al cargar las canciones.</p>;

    return (
        <div>
            <div className="my-5">
                <h2 className="mb-4">Busca la canción que quieras escuchar!</h2>
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
                    {songs.map((song, index) => {
                        if (songs.length === index + 1) {
                            return (
                                <div
                                    key={song.id}
                                    ref={lastSongElementRef}
                                    className="col-lg-4"
                                >
                                    <SongCard song={song} />
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={song.id}
                                    className="col-lg-4"
                                >
                                    <SongCard song={song} />
                                </div>
                            );
                        }
                    })}
                </div>
                {isLoading && <p>Cargando más canciones...</p>}
            </div>
        </div>
    );
}

export default SongList;
