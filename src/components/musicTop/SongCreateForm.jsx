import { useState } from "react";

export default function SongCreateForm() {
    const [songData, setSongData] = useState({ title: "" });
    const [songFile, setSongFile] = useState(null);

    function handleInputChange(event) {
        const { name, value } = event.target;
        setSongData({
            ...songData,
            [name]: value,
        });
    }

    function handleFileChange(event) {
        setSongFile(event.target.files[0]);
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log("Enviando formulario");

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Token no encontrado');
            return;
        }

        const formData = new FormData();
        formData.append("title", songData.title);

        if (songFile) {
            formData.append("song_file", songFile);
        } else {
            console.error("No se seleccionó ningún archivo.");
            return;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}harmonyhub/songs/`, {
            method: "POST",
            headers: {
                Authorization: `Token ${token}`,
            },
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    return (
        <form 
            className="p-4 bg-light border rounded"
            onSubmit={handleSubmit}
        >
            <div className="mb-3">
                <label className="form-label">Título</label>
                <input 
                    className="form-control" 
                    type="text"
                    name="title"
                    value={songData.title}
                    onChange={handleInputChange}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Subir Canción</label>
                <input 
                    className="form-control" 
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
            <div className="mb-3">
                <button className="btn btn-primary" type="submit">
                    Subir
                </button>
            </div>
        </form>
    );
}
