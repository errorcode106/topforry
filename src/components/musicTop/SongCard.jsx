function SongCard({ song }) {
    return (
        <div style={{ backgroundColor: '#4341b2' }} className="card text-white mb-4">
            <div className="card-body">
                <h5 className="card-title">{song.title}</h5>
                <audio controls className="w-100 mt-3">
                    <source src={song.song_file} type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        </div>
    );
}

export default SongCard;
