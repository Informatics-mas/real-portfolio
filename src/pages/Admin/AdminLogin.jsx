import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import SafeIcon from '../../pages/safeicon';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects ou problème de connexion.");
    } else if (data.session) {
      navigate('/admin/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />

      <div className="glass-card bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-10 md:p-12 rounded-[40px] shadow-2xl relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <SafeIcon name="Server" size={40} className="text-cyan-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tighter italic uppercase text-white">Zone <span className="text-purple-400">Restreinte</span></h1>
          <p className="text-gray-500 tracking-[0.2em] uppercase text-[10px] mt-2">Authentification requise</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] tracking-widest text-cyan-500/60 ml-2 font-black uppercase">Email Admin</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-white focus:border-cyan-500 focus:bg-white/10 transition-all"
              placeholder="admin@domaine.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] tracking-widest text-purple-500/60 ml-2 font-black uppercase">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-white focus:border-purple-500 focus:bg-white/10 transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center font-bold tracking-widest uppercase">{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl font-black tracking-[0.2em] text-sm text-white uppercase hover:shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Vérification...' : 'Déverrouiller'}
          </button>
        </form>
        
        <button onClick={() => navigate('/')} className="w-full text-center mt-6 text-[10px] tracking-[0.2em] text-gray-500 uppercase hover:text-white transition-colors">
          Retour au site public
        </button>
      </div>
    </div>
  );
}