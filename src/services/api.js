const API_KEY = process.env.API_KEY;//Your api key
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch trailers for a specific movie
export const getMovieVideos = async (movieId) => {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await res.json();

  // Filter for official YouTube trailers
  const trailers = data.results.filter(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return trailers; // array of trailer objects
};

// Example usage for popular movies
export const getPopularMovies = async () => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();

  // Fetch details for each movie
  const detailedMovies = await Promise.all(
    data.results.map(async (movie) => {
      const detailRes = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`);
      const details = await detailRes.json();
      return details;
    })
  );

  return detailedMovies;
};

// Search for movies
export const SearchMovies = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();

  if (data.results.length === 0) return [];

  // Fetch full details for top 5 results
  const detailedMovies = await Promise.all(
    data.results.slice(0, 5).map(async (movie) => {
      const detailRes = await fetch(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`);
      const details = await detailRes.json();
      return details;
    })
  );

  return detailedMovies;
};

export const getMovieWithVideos = async (id) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
  );
  const data = await res.json();
  return data;
};
