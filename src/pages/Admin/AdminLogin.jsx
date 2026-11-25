import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import SafeIcon from '../../pages/safeicon';

const DASHBOARD_PATH = '/admin/dashboard';

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-cyan-400/70 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Déjà connecté ? On va directement au tableau de bord.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate(DASHBOARD_PATH, { replace: true });
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Identifiants incorrects ou problème de connexion.');
    } else if (data.session) {
      navigate(DASHBOARD_PATH);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div aria-hidden="true" className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full" />
      <div aria-hidden="true" className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl"
      >
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
            <SafeIcon name="Server" size={26} className="text-violet-300" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Espace administrateur
          </h1>
          <p className="mt-2 text-sm text-gray-400">Connectez-vous pour gérer votre portfolio.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@domaine.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-gray-300">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-24`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-violet-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Vérification…
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 w-full text-center text-sm text-gray-400 transition-colors hover:text-white"
        >
          ← Retour au site public
        </button>
      </motion.div>
    </div>
  );
}