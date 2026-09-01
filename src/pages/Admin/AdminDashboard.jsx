import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; 

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ total: 0, today: 0, thisMonth: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  const [editingProject, setEditingProject] = useState(null);
  const [formValues, setFormValues] = useState({
    title: '', description: '', tags: '', demo_link: '', code_link: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data: viewsData, error: viewsError } = await supabase
        .from('page_views')
        .select('created_at');

      if (!viewsError && viewsData) {
        const total = viewsData.length;
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let todayCount = 0;
        let monthCount = 0;

        viewsData.forEach(view => {
          const viewDate = new Date(view.created_at);
          const viewDateStr = viewDate.toISOString().split('T')[0];

          if (viewDateStr === todayStr) todayCount++;
          if (viewDate.getMonth() === currentMonth && viewDate.getFullYear() === currentYear) monthCount++;
        });

        setStats({ total, today: todayCount, thisMonth: monthCount });
      }
      setIsLoadingStats(false);
      fetchProjects();
    };

    fetchData();
  }, []);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setIsLoadingProjects(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert(`Erreur : ${error.message}`);
    } else {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormValues({
      title: project.title || '',
      description: project.description || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      demo_link: project.demo_link || '',
      code_link: project.code_link || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setFormValues({ title: '', description: '', tags: '', demo_link: '', code_link: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Traitement en cours...");

    const tagsArray = formValues.tags.split(',').map(tag => tag.trim());
    const imageFile = e.target.image_file.files[0];
    let imageUrl = editingProject ? editingProject.image_url : "";

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage(`Erreur upload image : ${uploadError.message}`);
        setIsSubmitting(false);
        return;
      }
      const { data: publicURLData } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);
      imageUrl = publicURLData.publicUrl;
    }

    const projectData = {
      title: formValues.title, description: formValues.description,
      tags: tagsArray, image_url: imageUrl,
      demo_link: formValues.demo_link, code_link: formValues.code_link
    };

    if (editingProject) {
      const { error } = await supabase.from('projects').update(projectData).eq('id', editingProject.id);
      if (error) setMessage(`Erreur : ${error.message}`);
      else {
        setMessage("Projet mis à jour avec succès !");
        setEditingProject(null);
        handleCancelEdit();
        fetchProjects();
      }
    } else {
      const { error } = await supabase.from('projects').insert([projectData]);
      if (error) setMessage(`Erreur : ${error.message}`);
      else {
        setMessage("Projet ajouté avec succès !");
        handleCancelEdit();
        fetchProjects();
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="h-[2px] w-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></span>
              <span className="text-cyan-500 text-[10px] font-black tracking-[0.4em] uppercase">Espace Sécurisé</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter italic uppercase text-white">
              Terminal <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Admin</span>
            </h1>
          </div>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/20 text-xs font-bold tracking-widest uppercase flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour au site
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="relative z-10 text-[10px] tracking-widest text-gray-500 uppercase font-black mb-3">Vues Aujourd'hui</p>
            <h3 className="relative z-10 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{isLoadingStats ? '...' : stats.today}</h3>
          </div>
          <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="relative z-10 text-[10px] tracking-widest text-gray-500 uppercase font-black mb-3">Vues ce Mois</p>
            <h3 className="relative z-10 text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{isLoadingStats ? '...' : stats.thisMonth}</h3>
          </div>
          <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 rounded-[32px] hover:bg-white/[0.04] hover:border-white/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <p className="relative z-10 text-[10px] tracking-widest text-gray-500 uppercase font-black mb-3">Vues Totales</p>
            <h3 className="relative z-10 text-5xl font-black text-white">{isLoadingStats ? '...' : stats.total}</h3>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[32px] mb-12 relative shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
              {editingProject ? "Mise à jour du projet" : "Nouveau Déploiement"}
            </h2>
            {editingProject && (
              <button onClick={handleCancelEdit} className="text-[10px] px-4 py-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 uppercase tracking-widest font-black transition-all">
                ✕ Annuler
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-2">Titre du projet</label>
                <input type="text" name="title" required value={formValues.title} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder:text-gray-700" placeholder="Ex: Otaku World" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-2">Technologies (Tags)</label>
                <input type="text" name="tags" required value={formValues.tags} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all text-white placeholder:text-gray-700" placeholder="React, Tailwind, Supabase..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-2">Description</label>
              <textarea name="description" required rows="4" value={formValues.description} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-white placeholder:text-gray-700 resize-none" placeholder="Décrivez les fonctionnalités principales du projet..."></textarea>
            </div>
            
            <div className="space-y-2 p-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-colors group">
              <label className="text-[10px] uppercase tracking-widest text-cyan-500 font-black mb-2 block cursor-pointer">
                {editingProject ? "📸 Remplacer l'image (Optionnel)" : "📸 Uploader une image"}
              </label>
              <input type="file" name="image_file" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-2">Lien vers le site (Demo)</label>
                <input type="url" name="demo_link" value={formValues.demo_link} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-cyan-500/50 transition-all text-white placeholder:text-gray-700" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-black ml-2">Lien vers le code (Github)</label>
                <input type="url" name="code_link" value={formValues.code_link} onChange={handleInputChange} className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-purple-500/50 transition-all text-white placeholder:text-gray-700" placeholder="https://github.com/..." />
              </div>
            </div>

            <button disabled={isSubmitting} type="submit" className="w-full py-5 mt-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-2xl font-black tracking-[0.2em] uppercase text-xs shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50 active:scale-[0.98]">
              {isSubmitting ? 'Synchronisation...' : editingProject ? 'Enregistrer les modifications' : 'Déployer le projet'}
            </button>
            
            {message && (
              <div className="p-4 mt-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase">{message}</p>
              </div>
            )}
          </form>
        </div>

        {/* Liste des projets */}
        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[32px] shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 tracking-tight text-white flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
            Base de données des projets
          </h2>

          {isLoadingProjects ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 text-sm tracking-widest uppercase font-bold">Base de données vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 p-5 rounded-2xl gap-6 transition-all duration-300">
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    {project.image_url ? (
                      <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 group-hover:border-cyan-500/30 transition-colors">
                        <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ) : (
                      <div className="w-20 h-14 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">N/A</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1 max-w-md">{project.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button onClick={() => handleEditClick(project)} className="flex-1 md:flex-none px-5 py-2.5 bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                      Éditer
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="flex-1 md:flex-none px-5 py-2.5 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}