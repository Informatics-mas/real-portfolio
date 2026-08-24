import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ total: 0, today: 0, thisMonth: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('page_views')
        .select('created_at');

      if (!error && data) {
        const total = data.length;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let todayCount = 0;
        let monthCount = 0;

        data.forEach(view => {
          const viewDate = new Date(view.created_at);
          const viewDateStr = viewDate.toISOString().split('T')[0];

          if (viewDateStr === todayStr) todayCount++;
          if (viewDate.getMonth() === currentMonth && viewDate.getFullYear() === currentYear) monthCount++;
        });

        setStats({ total, today: todayCount, thisMonth: monthCount });
      }
      setIsLoadingStats(false);
    };

    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Traitement en cours...");

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const tagsArray = formData.get('tags').split(',').map(tag => tag.trim());
    const demoLink = formData.get('demo_link');
    const codeLink = formData.get('code_link');
    const imageFile = e.target.image_file.files[0];

    let imageUrl = "";

    // 1. Si un fichier image a été sélectionné, on l'uploade sur Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        setMessage(`Erreur upload image : ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Récupérer l'URL publique de l'image stockée
      const { data: publicURLData } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath);

      imageUrl = publicURLData.publicUrl;
    }

    // 3. Insérer le projet avec l'URL de l'image dans la table 'projects'
    const newProject = {
      title,
      description,
      tags: tagsArray,
      image_url: imageUrl,
      demo_link: demoLink,
      code_link: codeLink
    };

    const { error } = await supabase.from('projects').insert([newProject]);

    if (error) {
      setMessage(`Erreur base de données : ${error.message}`);
    } else {
      setMessage("Projet et image ajoutés avec succès !");
      e.target.reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-bold text-cyan-400">Terminal Admin</h1>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
            Retour au site
          </button>
        </div>

        {/* STATISTIQUES DE VISITE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="test-[10px] tracking-widest text-gray-500 uppercase font-black mb-2">Vues Aujourd'hui</p>
            <h3 className="text-3xl font-bold text-cyan-400">{isLoadingStats ? '...' : stats.today}</h3>
          </div>
          <div className="glass-card bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] tracking-widest text-gray-500 uppercase font-black mb-2">Vues ce Mois</p>
            <h3 className="text-3xl font-bold text-purple-400">{isLoadingStats ? '...' : stats.thisMonth}</h3>
          </div>
          <div className="glass-card bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
            <p className="text-[10px] tracking-widest text-gray-500 uppercase font-black mb-2">Vues Totales</p>
            <h3 className="text-3xl font-bold text-white">{isLoadingStats ? '...' : stats.total}</h3>
          </div>
        </div>

        {/* FORMULAIRE AJOUT DE PROJET */}
        <div className="glass-card bg-white/[0.02] border border-white/5 p-8 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 italic text-purple-400">Ajouter un nouveau projet //</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="title" required placeholder="Titre du projet" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
              <input type="text" name="tags" required placeholder="Tags (séparés par des virgules)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
            </div>

            <textarea name="description" required rows="3" placeholder="Description courte..." className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 transition-colors"></textarea>
            
            {/* CHAMP FICHIER POUR L'IMAGE */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 ml-1">Capture d'écran du projet (PNG, JPG)</label>
              <input type="file" name="image_file" accept="image/*" className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 transition-colors cursor-pointer" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="url" name="demo_link" placeholder="Lien Live Demo" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
              <input type="url" name="code_link" placeholder="Lien Code Source (Github)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-cyan-500 transition-colors" />
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-bold tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? 'Upload & Déploiement...' : 'Ajouter le projet'}
            </button>
            
            {message && <p className="text-center mt-4 text-cyan-400 text-sm">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}