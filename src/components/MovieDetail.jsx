import { useState } from 'react';
import { useUserData } from '../context/UserDataContext';

const MovieDetail = ({ movie }) => {
  const { userData, setRating, toggleWatched, toggleWatchlist, setNote } = useUserData();

  const movieUserData = userData[movie.id] || {};
  const userRating = movieUserData.rating || 0;
  const watched = movieUserData.watched || false;
  const watchlist = movieUserData.watchlist || false;
  const note = movieUserData.note || '';

  const [hoverRating, setHoverRating] = useState(0);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const tmdbRating = movie.vote_average?.toFixed(1);
  const genres = movie.genres?.map((g) => g.name).join(', ') || '—';
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : '—';
  const duration = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}ч ${movie.runtime % 60}мин`
    : null;

  const noteMaxLength = 200;

  const handleNoteChange = (e) => {
    const value = e.target.value.slice(0, noteMaxLength);
    setNote(movie.id, value);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
      {backdropUrl && (
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-20 dark:opacity-10">
          <img
            src={backdropUrl}
            alt=""
            className="w-full h-full object-cover blur-xl scale-110"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        {/* Постер */}
        <div className="flex-shrink-0 w-full md:w-64 lg:w-80">
          {posterUrl ? (
            <img src={posterUrl} alt={movie.title} className="w-full rounded-xl shadow-2xl" />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center text-6xl">
              🎬
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-lg text-gray-500 dark:text-gray-400 italic mt-1">{movie.tagline}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-300">
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{year}</span>
            {duration && (
              <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{duration}</span>
            )}
            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{genres}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-yellow-500">★</span>
            <span className="text-2xl font-semibold text-gray-900 dark:text-white">{tmdbRating}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ 10</span>
            <span className="text-sm text-gray-400">({movie.vote_count} оценок)</span>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Обзор</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {movie.overview || 'Описание отсутствует.'}
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Моя оценка</p>
              <div className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-2xl transition-transform duration-150 ${
                      star <= (hoverRating || userRating)
                        ? 'text-yellow-500 scale-110'
                        : 'text-gray-300 dark:text-gray-600'
                    } hover:scale-125`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(movie.id, star)}
                    aria-label={`Оценка ${star} из 10`}
                  >
                    ★
                  </button>
                ))}
                {userRating > 0 && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 self-end mb-1">
                    {userRating}/10
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => toggleWatched(movie.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  watched
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {watched ? '✓ Просмотрен' : 'Отметить просмотренным'}
              </button>
              <button
                onClick={() => toggleWatchlist(movie.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  watchlist
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {watchlist ? '✓ В списке к просмотру' : 'Добавить в вотчлист'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Личная заметка ({note.length}/{noteMaxLength})
              </label>
              <textarea
                value={note}
                onChange={handleNoteChange}
                maxLength={noteMaxLength}
                rows={3}
                placeholder="Что вы думаете об этом фильме? (до 200 символов)"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;