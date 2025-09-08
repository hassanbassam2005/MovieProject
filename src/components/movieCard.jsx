import '../css/MovieCard.css';
import { useMovieContext } from '../context/MovieContext';

function MovieCard({ movie, onPopup, onClickMovie }) {
  const { isFavorite, addTofavorite, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  const handleFavorite = (e) => {
    e.stopPropagation(); // prevent triggering the movie click
    if (favorite) {
      removeFromFavorites(movie.id);
      onPopup && onPopup("Removed from favorites!");
    } else {
      addTofavorite(movie);
      onPopup && onPopup("Added to favorites!");
    }
  };

  return (
    <div className="movie-card" onClick={() => onClickMovie && onClickMovie(movie)}>
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={handleFavorite}
          >
            ❤️
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;
