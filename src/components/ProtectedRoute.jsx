import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Vérifie s'il y a déjà une session active au montage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsChecking(false);
    });

    // Écoute les changements d'état (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isChecking) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-500">Chargement...</div>;
  }

  // Si pas de session, on redirige vers le login
  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  // Si connecté, on affiche le composant enfant (le Dashboard)
  return children;
}