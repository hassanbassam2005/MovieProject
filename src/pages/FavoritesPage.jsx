import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/movieCard";
function Fav() {
  const { favorites } = useMovieContext();
  if (favorites) {
    return (
        <div className="favorites">
            <h2>Your Favorite movies</h2>
      <div className="movie-grid">
        {favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorites Yet</h2>
      <p>add some favorite movies here to watch later</p>
    </div>
  );
}

export default Fav;
