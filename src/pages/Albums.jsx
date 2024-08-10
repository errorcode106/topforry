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

        const formData = new FormData();
        formData.append("title", songData.title);

        if (songFile) {
            formData.append("song_file", songFile);
        } else {
            console.error("No se seleccionó ningún archivo.");
            return;
        }

        fetch('https://sandbox.academiadevelopers.com/harmonyhub/songs/', {
            method: "POST",
            headers: {
                Authorization: 'Token 4ea3999c6a9f50cf0ac2f4751f11e111fb94b311',
               
            },
            body: formData,
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }

    return (
        <form 
            className={'box m-4 p-4 has-background-light'}
            onSubmit={handleSubmit}
        >
            <div className="field">
                <label className="label">Título</label>
                <div className="control">
                    <input className="input" 
                        type="text"
                        name="title"
                        value={songData.title}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="field">
                <label className="label">Subir Canción</label>
                <div className="control">
                    <input className="input" 
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>
            </div>
            <div className="Field">
                <div className="control">
                    <button className="button is-primary" type="submit">
                        Subir
                    </button>
                </div>
            </div>
        </form>
    );
}
