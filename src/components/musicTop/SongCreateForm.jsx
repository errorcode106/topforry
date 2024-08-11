import { useState, useRef } from "react";

export default function SongCreateForm() {
    const [songData, setSongData] = useState({ title: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputRef = useRef(null); 

    function handleInputChange(event) {
        const { name, value } = event.target;
        setSongData({
            ...songData,
            [name]: value,
        });
    }

    function handleFileChange(event) {
        
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

        const file = fileInputRef.current.files[0]; 
        if (file) {
            formData.append("song_file", file);
        } else {
            console.error("No se seleccionó ningún archivo.");
            return;
        }


        fetch(`https://sandbox.academiadevelopers.com/harmonyhub/songs/`, {
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
        .then(data => {
            console.log(data);     
            setSuccessMessage("Canción cargada con éxito.");
            setSongData({ title: "" });
            fileInputRef.current.value = ""; 
        })
        .catch(error => console.error('Error:', error));
    }

    return (
        <div>
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
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
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                    />
                </div>
                <div className="mb-3">
                    <button className="btn btn-primary" type="submit">
                        Subir
                    </button>
                </div>
            </form>
        </div>
    );
}

