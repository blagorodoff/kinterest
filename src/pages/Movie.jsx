import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../services/api';
import MovieDetail from '../components/MovieDetail';

const Movie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Не удалось загрузить данные фильма.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  return (
    <>
      {loading && (
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto" />
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl max-w-sm mx-auto" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mx-auto" />
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {!loading && !error && movie && <MovieDetail movie={movie} />}
    </>
  );
};

export default Movie;