function SongCard({ song }) {
    
    const backgroundClassName = "has-background-" 

    let textClassName = "has-text-";

    const className = backgroundClassName + " " + textClassName;
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
                        <source src={song.song_file} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                    </audio>
                </div>
            </div>
        </div>
    );
}

export default SongCard;