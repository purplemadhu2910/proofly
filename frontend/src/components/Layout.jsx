import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { getSpaces } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from './ui/Skeleton';

export const Layout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [loadingSpaces, setLoadingSpaces] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    const fetchOwnerSpaces = async () => {
      setLoadingSpaces(true);
      try {
        const res = await getSpaces();
        const loadedSpaces = res.data || [];
        setSpaces(loadedSpaces);
        if (loadedSpaces.length > 0) {
          setCurrentSpace(loadedSpaces[0]);
        } else {
          setCurrentSpace(null);
        }
      } catch (err) {
        console.error("Error loading owner spaces:", err);
        setSpaces([]);
        setCurrentSpace(null);
      } finally {
        setLoadingSpaces(false);
      }
    };

    if (user) {
      fetchOwnerSpaces();
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (user && loadingSpaces)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl coss-gradient-bg animate-pulse flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30">
          P
        </div>
        <Skeleton width="w-48" height="h-3" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Navbar
        currentSpace={currentSpace}
        spaces={spaces}
        onSelectSpace={(s) => setCurrentSpace(s)}
      />

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet context={{ spaces, currentSpace, setCurrentSpace, setSpaces }} />
        </main>
      </div>
    </div>
  );
};
