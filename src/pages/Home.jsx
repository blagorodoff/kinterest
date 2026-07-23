import { useState, useEffect, useMemo } from 'react';
import Masonry from 'react-masonry-css';
import { fetchPopularMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import FeaturedMovie from '../components/FeaturedMovie';

const breakpointColumnsObj = {
  default: 5,
  1280: 4,
  1024: 3,
  768: 2,
  640: 2,
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const popularMovies = await fetchPopularMovies();
        setMovies(popularMovies);
      } catch (err) {
        setError('Не удалось загрузить фильмы. Проверьте интернет или API-ключ.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  const featuredMovie = useMemo(() => {
    if (movies.length === 0) return null;
    return movies[Math.floor(Math.random() * movies.length)];
  }, [movies]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Добро пожаловать в Кинтерест</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Ваш личный кинодневник — оценивайте, сохраняйте, вспоминайте.
        </p>
      </div>

      {loading && (
        <>
          <div className="animate-pulse mb-8 h-64 sm:h-96 bg-gray-300 dark:bg-gray-700 rounded-2xl" />
          <Masonry breakpointCols={breakpointColumnsObj} className="flex -ml-4 w-auto" columnClassName="pl-4 bg-clip-padding">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="mb-4 animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <div className="w-full aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
                  <div className="p-3"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" /><div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" /></div>
                </div>
              </div>
            ))}
          </Masonry>
        </>
      )}

      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Попробовать снова</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {featuredMovie && (
            <>
              <FeaturedMovie movie={featuredMovie} />
              <div className="mt-12 mb-6">
                <h2 className="text-3xl font-bold">Популярные фильмы сегодня</h2>
              </div>
            </>
          )}
          <Masonry breakpointCols={breakpointColumnsObj} className="flex -ml-4 w-auto" columnClassName="pl-4 bg-clip-padding">
            {movies.map((movie, index) => (
              <div key={movie.id} className="mb-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Masonry>
        </>
      )}
    </div>
  );
};

export default Home;