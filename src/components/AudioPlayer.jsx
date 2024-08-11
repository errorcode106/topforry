import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepBackward, faStepForward, faVolumeUp, faRedoAlt, faRandom } from '@fortawesome/free-solid-svg-icons';
import './AudioPlayer.css';

const AudioPlayer = ({ songFile, coverImage, title, artist, playing, setPlaying }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (audioRef.current && songFile) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [playing, songFile]);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      const progressValue = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      progressRef.current.value = isNaN(progressValue) ? 0 : progressValue;
    }
  };

  const handleProgressChange = (e) => {
    const seekTime = (e.target.value / 100) * (audioRef.current ? audioRef.current.duration : 0);
    if (audioRef.current) {
      audioRef.current.currentTime = isNaN(seekTime) ? 0 : seekTime;
    }
  };

  useEffect(() => {
    if (audioRef.current && songFile) {
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
      };
    }
  }, [songFile]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Verificar si hay un archivo de canción
  if (!songFile) {
    return (
      <div className="audio-player">
        <div className="cover">
          <img src={coverImage} alt="Cover" className="img-fluid rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="audio-player">
      <div className="cover">
        <img src={coverImage} alt={title} />
      </div>
      <div className="info">
        <h4>{title}</h4>
        <p>{artist}</p>
      </div>
      <div className="progress-container">
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          ref={progressRef}
          defaultValue="0"
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <span>{formatTime(duration)}</span>
      </div>
      <div className="controls">
        <button className="btn-control">
          <FontAwesomeIcon icon={faRandom} />
        </button>
        <button className="btn-control">
          <FontAwesomeIcon icon={faStepBackward} />
        </button>
        <button className="btn-control play-pause" onClick={handlePlayPause}>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </button>
        <button className="btn-control">
          <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button className="btn-control">
          <FontAwesomeIcon icon={faRedoAlt} />
        </button>
      </div>
      <div className="volume-control">
        <FontAwesomeIcon icon={faVolumeUp} />
        <input
          type="range"
          ref={volumeRef}
          defaultValue="1"
          step="0.01"
          min="0"
          max="1"
          onChange={handleVolumeChange}
          className="volume-bar"
        />
      </div>
      <audio
        ref={audioRef}
        src={songFile}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default AudioPlayer;
