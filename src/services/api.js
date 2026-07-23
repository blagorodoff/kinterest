const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Функция для получения популярных фильмов
export const fetchPopularMovies = async (page = 1) => {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU&page=${page}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Ошибка при загрузке популярных фильмов:', error);
    throw error;
  }
};


export const fetchMovieDetails = async (movieId) => {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ru-RU`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
  return await response.json();
};

export const fetchMoviesByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  
  const requests = ids.map(id =>
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=ru-RU`)
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка загрузки фильма ${id}`);
        return res.json();
      })
      .catch(err => {
        console.error(`Не удалось загрузить фильм ${id}:`, err);
        return null;
      })
  );

  const movies = await Promise.all(requests);
  return movies.filter(Boolean);
};