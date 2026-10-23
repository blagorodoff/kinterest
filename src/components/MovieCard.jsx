import { Link } from 'react-router-dom';
import { IMG_BASE_URL } from '../services/api';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path ? `${IMG_BASE_URL}/w500${movie.poster_path}` : null;

  const rating = movie.vote_average?.toFixed(1);
  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const overview = movie.overview
    ? movie.overview.length > 120
      ? movie.overview.slice(0, 120) + '...'
      : movie.overview
    : null;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 group"
    >
      <div className="relative w-full bg-gray-200 dark:bg-gray-700">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center w-full aspect-[2/3] text-gray-400 dark:text-gray-500 text-6xl">
            🎬
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
          ★ {rating ?? '—'}
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
          {movie.title}
        </h3>
        {year && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{year}</p>
        )}
        {overview && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-3 leading-relaxed">
            {overview}
          </p>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;