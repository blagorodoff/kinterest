import { useState, useEffect, useRef, useCallback } from 'react';
import { useUserData } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import { fetchMoviesByIds } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { userData, loading: userDataLoading } = useUserData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('watched');
  const [moviesDetails, setMoviesDetails] = useState({});
  const [loadingMovies, setLoadingMovies] = useState(false);
  const tabRefs = useRef({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabs = [
    { key: 'watched', label: 'Просмотрено' },
    { key: 'watchlist', label: 'Буду смотреть' },
    { key: 'notes', label: 'Заметки' },
  ];

  const watchedIds = Object.keys(userData).filter(id => userData[id].watched);
  const watchlistIds = Object.keys(userData).filter(id => userData[id].watchlist);
  const notesIds = Object.keys(userData).filter(id => userData[id].note?.trim());

  const updateIndicator = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      const { offsetLeft, offsetWidth } = activeEl;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    const idsToLoad = activeTab === 'watched' ? watchedIds : activeTab === 'watchlist' ? watchlistIds : notesIds;
    const missingIds = idsToLoad.filter(id => !moviesDetails[id]);
    if (missingIds.length === 0) return;
    let cancelled = false;
    setLoadingMovies(true);
    fetchMoviesByIds(missingIds)
      .then(movies => {
        if (cancelled) return;
        setMoviesDetails(prev => {
          const newD = { ...prev };
          movies.forEach(m => newD[m.id] = m);
          return newD;
        });
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoadingMovies(false); });
    return () => { cancelled = true; };
  }, [activeTab, watchedIds, watchlistIds, notesIds, moviesDetails]);

  const renderMovieList = (ids) => {
    if (ids.length === 0) {
      return (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <p className="text-6xl mb-4">🎞️</p>
          <p className="text-lg">Здесь пока пусто</p>
          <p className="text-sm mt-2">
            {activeTab === 'watched' && 'Отметьте фильмы как просмотренные.'}
            {activeTab === 'watchlist' && 'Добавьте фильмы в список к просмотру.'}
            {activeTab === 'notes' && 'Напишите заметки к фильмам.'}
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ids.map(id => {
          const movie = moviesDetails[id];
          const umd = userData[id] || {};
          return (
            <Link key={id} to={`/movie/${id}`} className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 relative">
                {movie ? (
                  <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : undefined} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl text-gray-400">🎬</div>
                )}
                {umd.rating > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">★ {umd.rating}</div>
                )}
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{movie ? movie.title : 'Загрузка...'}</h3>
                {movie && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{movie.release_date ? new Date(movie.release_date).getFullYear() : '—'}{movie.vote_average ? ` · ★ ${movie.vote_average.toFixed(1)}` : ''}</p>}
                {activeTab === 'notes' && umd.note && <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 italic">“{umd.note}”</p>}
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  if (userDataLoading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">Загрузка профиля...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          src={user?.photoURL || 'https://via.placeholder.com/150?text=Нет+фото'}
          alt={user?.displayName || 'Аватар'}
          className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">{user?.displayName || 'Мой профиль'}</h1>
          {user?.email && <p className="text-gray-500 dark:text-gray-400">{user.email}</p>}
        </div>
      </div>

      <div className="relative border-b border-gray-200 dark:border-gray-700 mb-6">
  <div className="overflow-x-auto">
    <div className="flex justify-center md:justify-start">
      {tabs.map(tab => (
        <button
          key={tab.key}
          ref={el => tabRefs.current[tab.key] = el}
          onClick={() => setActiveTab(tab.key)}
          className={`relative px-3 py-3 text-sm font-medium transition-colors duration-300 whitespace-nowrap flex-shrink-0 ${
            activeTab === tab.key
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          {tab.label}
          <span className="ml-1.5 text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {tab.key === 'watched' ? watchedIds.length : tab.key === 'watchlist' ? watchlistIds.length : notesIds.length}
          </span>
        </button>
      ))}
    </div>
  </div>
  <div
    className="absolute bottom-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ease-in-out"
    style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
  />
</div>

      {loadingMovies && <div className="text-center py-10 text-gray-500">Загрузка...</div>}
      {!loadingMovies && activeTab === 'watched' && renderMovieList(watchedIds)}
      {!loadingMovies && activeTab === 'watchlist' && renderMovieList(watchlistIds)}
      {!loadingMovies && activeTab === 'notes' && renderMovieList(notesIds)}
    </div>
  );
};

export default Profile;