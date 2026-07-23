const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Кинтерест. Данные о фильмах предоставлены TMDB.
      </div>
    </footer>
  );
};

export default Footer;