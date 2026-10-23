import { Link } from 'react-router-dom';
import { IMG_BASE_URL } from '../services/api';

const FeaturedMovie = ({ movie }) => {
  const backdrop = movie.backdrop_path
    ? `${IMG_BASE_URL}/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path
    ? `${IMG_BASE_URL}/w500${movie.poster_path}`
    : null;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative block rounded-2xl overflow-hidden shadow-xl group mb-8 h-64 sm:h-96"
    >
      {backdrop && (
        <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-yellow-500 text-black text-sm font-bold px-2 py-1 rounded-full">
            ★ {movie.vote_average?.toFixed(1)}
          </span>
          <span className="text-sm opacity-80">
            {movie.release_date?.slice(0, 4)}
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold mb-1">{movie.title}</h2>
        <p className="text-sm sm:text-base opacity-90 line-clamp-2 max-w-xl">
          {movie.overview}
        </p>
      </div>
    </Link>
  );
};

export default FeaturedMovie;