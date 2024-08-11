import { useNavigate } from 'react-router-dom';

function Inicio() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    };

    const backgroundClassName = "has-background-light"; 
    const className = backgroundClassName;
    const textClassName = "has-text-dark"; 
    const song = {
        title: "Nobody",
    };

    return (
        <div className={`card ${className}`}>
            <div className="card-content">
                <div className="media">
                    <div className="media-content">
                        <p className={`title is-4 ${textClassName}`}>
                            {song.title}
                        </p>
                    </div>
                </div>
                <div className="content">
                    <audio controls>
                        <source src="https://sandbox.academiadevelopers.com/media/harmonyhub/songs/OneRepublic_-_Nobody_from_Kaiju_No_8__BaseNaija_q8IOY6P.mp3" type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
