import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

const UserDataContext = createContext(null);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) throw new Error('useUserData должен быть внутри UserDataProvider');
  return context;
};

export const UserDataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    const loadData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const movieDataCol = collection(userDocRef, 'movieData');
        const snapshot = await getDocs(movieDataCol);
        const firestoreData = {};
        snapshot.forEach(docSnap => {
          firestoreData[docSnap.id] = docSnap.data();
        });

        // Перенос из localStorage (однократный)
        const local = localStorage.getItem('kinteest_user_data');
        if (local) {
          const parsed = JSON.parse(local);
          const batch = writeBatch(db);
          let hasNew = false;
          for (const [rawId, data] of Object.entries(parsed)) {
            const movieId = String(rawId); // гарантируем строку
            if (!firestoreData[movieId]) {
              batch.set(doc(userDocRef, 'movieData', movieId), data);
              firestoreData[movieId] = data;
              hasNew = true;
            }
          }
          if (hasNew) await batch.commit();
          localStorage.removeItem('kinteest_user_data');
        }

        setUserData(firestoreData);
      } else {
        const saved = localStorage.getItem('kinteest_user_data');
        setUserData(saved ? JSON.parse(saved) : {});
      }
      setLoading(false);
    };

    loadData();
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !loading && !user) {
      localStorage.setItem('kinteest_user_data', JSON.stringify(userData));
    }
  }, [userData, user, authLoading, loading]);

  const updateMovieData = useCallback(async (movieId, updates) => {
    const id = String(movieId); // ключ в состояние и Firestore
    setUserData(prev => {
      const newData = {
        ...prev,
        [id]: {
          ...prev[id],
          ...updates,
        },
      };
      
      if (user) {
        const movieDocRef = doc(db, 'users', user.uid, 'movieData', id);
        setDoc(movieDocRef, newData[id], { merge: true }).catch(console.error);
      }

      return newData;
    });
  }, [user]);

  const setRating = useCallback((movieId, rating) => {
    updateMovieData(movieId, { rating });
  }, [updateMovieData]);

  const toggleWatched = useCallback((movieId) => {
    const id = String(movieId);
    setUserData(prev => {
      const current = prev[id] || {};
      const newWatched = !current.watched;
      const updates = {
        watched: newWatched,
        watchlist: newWatched ? false : current.watchlist,
      };
      if (user) {
        const movieDocRef = doc(db, 'users', user.uid, 'movieData', id);
        setDoc(movieDocRef, { ...current, ...updates }, { merge: true }).catch(console.error);
      }
      return {
        ...prev,
        [id]: {
          ...current,
          ...updates,
        },
      };
    });
  }, [user]);

  const toggleWatchlist = useCallback((movieId) => {
    const id = String(movieId);
    setUserData(prev => {
      const current = prev[id] || {};
      const newWatchlist = !current.watchlist;
      const updates = {
        watchlist: newWatchlist,
        watched: newWatchlist ? false : current.watched,
      };
      if (user) {
        const movieDocRef = doc(db, 'users', user.uid, 'movieData', id);
        setDoc(movieDocRef, { ...current, ...updates }, { merge: true }).catch(console.error);
      }
      return {
        ...prev,
        [id]: {
          ...current,
          ...updates,
        },
      };
    });
  }, [user]);

  const setNote = useCallback((movieId, note) => {
    updateMovieData(movieId, { note });
  }, [updateMovieData]);

  return (
    <UserDataContext.Provider value={{ userData, loading, setRating, toggleWatched, toggleWatchlist, setNote }}>
      {children}
    </UserDataContext.Provider>
  );
};