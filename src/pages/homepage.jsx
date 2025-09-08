import MovieCard from "../components/movieCard";
import MoviePopup from "../components/popup";
import { useState, useEffect } from "react";
import "../css/Home.css";
import { SearchMovies, getPopularMovies, getMovieVideos } from "../services/api";

function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load popular movies on mount
  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
        setError(null);
      } catch (err) {
        console.log(err);
        setError("Failed to get the movies.");
      } finally {
        setLoading(false);
      }
    };
    loadPopularMovies();
  }, []);

  // Handle search
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search.trim() || loading) return;

    setLoading(true);
    try {
      const searchResults = await SearchMovies(search);
      setMovies(searchResults);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to search movies.");
    } finally {
      setLoading(false);
    }
  };

  // Handle movie card click
  const handleClickMovie = async (movie) => {
    try {
      const trailers = await getMovieVideos(movie.id);
      setSelectedMovie({ ...movie, trailers });
    } catch (err) {
      console.log(err);
      setSelectedMovie(movie); // fallback without trailer
    }
  };

  const handleClosePopup = () => setSelectedMovie(null);

  return (
    <div className="home">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search a movie name"
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Loading..</div>
      ) : (
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClickMovie={handleClickMovie}
            />
          ))}
        </div>
      )}

      {selectedMovie && (
        <MoviePopup movie={selectedMovie} onClose={handleClosePopup} />
      )}
    </div>
  );
}

export default Home;
