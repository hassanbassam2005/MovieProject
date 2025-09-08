import { useState } from "react";
import '../css/popup.css';

export default function MoviePopup({ movie, onClose }) {
  const trailerKey = movie.trailers?.[0]?.key; 
  const [play, setPlay] = useState(false);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>✖</button>

        <h2>{movie.title} ({movie.release_date?.split("-")[0]})</h2>
        <p>⭐ Rating: {movie.vote_average}</p>
        <p>{movie.overview}</p>

        {trailerKey && (
          <div className="video-container">
            {!play ? (
              <button className="play-btn" onClick={() => setPlay(true)}>▶ Play Trailer</button>
            ) : (
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&controls=1&modestbranding=1&rel=0`}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
