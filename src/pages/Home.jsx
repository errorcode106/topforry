import React, { useState } from 'react';
import SongManager from '../components/SongManager';

function Inicio() {
    const [songs, setSongs] = useState([]);

    return (
        <>
            <h1>Gestión de Canciones</h1>
            <SongManager songs={songs} setSongs={setSongs} />
        </>
    );
}

export default Inicio;
