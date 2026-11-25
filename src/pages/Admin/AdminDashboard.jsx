import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

// ✏️ Réglages
const ADMIN_LOGIN_PATH = '/admin'; // adresse de ta page de connexion (à adapter si besoin)

// Passe à true APRÈS avoir ajouté la colonne dans Supabase (SQL Editor) :
//   alter table projects add column if not exists featured boolean default false;
// Les projets cochés afficheront le badge « À la une » sur le site.
const ENABLE_FEATURED = false;

const EMPTY_FORM = { title: '', description: '', tags: '', demo_link: '', code_link: '', featured: false };

const inputClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-all duration-300 hover:border-white/20 focus:border-cyan-400/70 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]';

const Label = ({ htmlFor, children, hint }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-gray-300">
    {children}
    {hint && <span className="font-normal text-gray-500"> {hint}</span>}
  </label>
);

const StatCard = ({ label, value, isLoading }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
    <p className="mb-3 text-sm text-gray-400">{label}</p>
    <p className="font-display text-4xl font-bold tracking-tight text-white tabular-nums">
      {isLoading ? '…' : value}
    </p>
  </div>
);

const messageStyles = {
  success: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-300',
  error: 'border-red-400/20 bg-red-400/5 text-red-300',
  info: 'border-cyan-400/20 bg-cyan-400/5 text-cyan-300',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'info', text }
  const [stats, setStats] = useState({ total: 0, today: 0, thisMonth: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setProjects(data);
    setIsLoadingProjects(false);
  }, []);

  const loadStats = useCallback(async () => {
    const { data: viewsData, error } = await supabase.from('page_views').select('created_at');

    if (!error && viewsData) {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      let today = 0;
      let thisMonth = 0;

      viewsData.forEach((view) => {
        const date = new Date(view.created_at);
        if (date.toISOString().split('T')[0] === todayStr) today++;
        if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) thisMonth++;
      });

      setStats({ total: viewsData.length, today, thisMonth });
    }
    setIsLoadingStats(false);
  }, []);

  // Protège la page : sans session, retour à la connexion
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate(ADMIN_LOGIN_PATH, { replace: true });
      } else {
        setIsAuthChecked(true);
        loadStats();
        loadProjects();
      }
    });
  }, [navigate, loadStats, loadProjects]);

  // Les messages de succès disparaissent seuls
  useEffect(() => {
    if (message?.type !== 'success') return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  // La demande de confirmation de suppression expire après 4 secondes
  useEffect(() => {
    if (!pendingDeleteId) return;
    const timer = setTimeout(() => setPendingDeleteId(null), 4000);
    return () => clearTimeout(timer);
  }, [pendingDeleteId]);

  const resetForm = () => {
    setEditingProject(null);
    setFormValues(EMPTY_FORM);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate(ADMIN_LOGIN_PATH, { replace: true });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    setPendingDeleteId(null);
    if (error) {
      setMessage({ type: 'error', text: `Suppression impossible : ${error.message}` });
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (editingProject?.id === id) resetForm();
      setMessage({ type: 'success', text: 'Projet supprimé.' });
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setFormValues({
      title: project.title || '',
      description: project.description || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      demo_link: project.demo_link || '',
      code_link: project.code_link || '',
      featured: Boolean(project.featured),
    });
    setImagePreview(project.image_url || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(editingProject?.image_url || '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: 'info', text: 'Enregistrement en cours…' });

    const tagsArray = formValues.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const imageFile = fileInputRef.current?.files?.[0];
    let imageUrl = editingProject ? editingProject.image_url : '';

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        setMessage({ type: 'error', text: `Envoi de l'image impossible : ${uploadError.message}` });
        setIsSubmitting(false);
        return;
      }
      const { data: publicURLData } = supabase.storage.from('project-images').getPublicUrl(fileName);
      imageUrl = publicURLData.publicUrl;
    }

    const projectData = {
      title: formValues.title,
      description: formValues.description,
      tags: tagsArray,
      image_url: imageUrl,
      demo_link: formValues.demo_link,
      code_link: formValues.code_link,
      ...(ENABLE_FEATURED ? { featured: formValues.featured } : {}),
    };

    const { error } = editingProject
      ? await supabase.from('projects').update(projectData).eq('id', editingProject.id)
      : await supabase.from('projects').insert([projectData]);

    if (error) {
      setMessage({ type: 'error', text: `Erreur : ${error.message}` });
    } else {
      setMessage({
        type: 'success',
        text: editingProject ? 'Projet mis à jour.' : 'Projet ajouté.',
      });
      resetForm();
      loadProjects();
    }
    setIsSubmitting(false);
  };

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505]" role="status" aria-label="Vérification de la session">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] p-6 text-white selection:bg-violet-500/30 md:p-10">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-[-10%] top-[-20%] h-[50vw] w-[50vw] rounded-full bg-violet-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50vw] w-[50vw] rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* En-tête */}
        <header className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-white/5 pb-8 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm text-violet-300">Espace administrateur</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              Tableau de bord
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-white/25 hover:text-white"
            >
              Voir le site
            </button>
            <button
              onClick={handleLogout}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-medium text-gray-200 transition-colors hover:border-red-400/40 hover:text-red-300"
            >
              Se déconnecter
            </button>
          </div>
        </header>

        {/* Statistiques */}
        <section aria-label="Statistiques" className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Vues aujourd'hui" value={stats.today} isLoading={isLoadingStats} />
          <StatCard label="Vues ce mois" value={stats.thisMonth} isLoading={isLoadingStats} />
          <StatCard label="Vues au total" value={stats.total} isLoading={isLoadingStats} />
          <StatCard label="Projets publiés" value={projects.length} isLoading={isLoadingProjects} />
        </section>

        {/* Formulaire */}
        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white">
              {editingProject ? `Modifier « ${editingProject.title} »` : 'Ajouter un projet'}
            </h2>
            {editingProject && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-white/25 hover:text-white"
              >
                Annuler
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="project-title">Titre du projet</Label>
                <input id="project-title" type="text" name="title" required value={formValues.title} onChange={handleInputChange} className={inputClass} placeholder="Ex : Otaku World" />
              </div>
              <div>
                <Label htmlFor="project-tags" hint="(séparées par des virgules)">Technologies</Label>
                <input id="project-tags" type="text" name="tags" required value={formValues.tags} onChange={handleInputChange} className={inputClass} placeholder="React, Tailwind, Supabase" />
              </div>
            </div>

            <div>
              <Label htmlFor="project-description">Description</Label>
              <textarea id="project-description" name="description" required rows={4} value={formValues.description} onChange={handleInputChange} className={`${inputClass} resize-none`} placeholder="Quel problème résout ce projet ? Quelles sont ses fonctionnalités principales ?" />
            </div>

            {/* Image */}
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-5">
              <Label htmlFor="project-image" hint={editingProject ? '(laisser vide pour garder l\'actuelle)' : ''}>
                Capture d'écran
              </Label>
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Aperçu de l'image du projet" className="h-24 w-40 shrink-0 rounded-xl border border-white/10 object-cover object-top" />
                ) : (
                  <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-gray-500">
                    Aucune image
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  id="project-image"
                  type="file"
                  name="image_file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer text-sm text-gray-400 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-white/10 file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-white hover:file:bg-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="project-demo" hint="(facultatif)">Lien vers le site</Label>
                <input id="project-demo" type="url" name="demo_link" value={formValues.demo_link} onChange={handleInputChange} className={inputClass} placeholder="https://…" />
              </div>
              <div>
                <Label htmlFor="project-code" hint="(facultatif)">Lien vers le code</Label>
                <input id="project-code" type="url" name="code_link" value={formValues.code_link} onChange={handleInputChange} className={inputClass} placeholder="https://github.com/…" />
              </div>
            </div>

            {ENABLE_FEATURED && (
              <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-300">
                <input type="checkbox" name="featured" checked={formValues.featured} onChange={handleInputChange} className="h-4 w-4 accent-violet-500" />
                Mettre ce projet à la une
              </label>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-violet-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Enregistrement…
                </>
              ) : editingProject ? (
                'Enregistrer les modifications'
              ) : (
                'Publier le projet'
              )}
            </button>

            {message && (
              <p role={message.type === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${messageStyles[message.type]}`}>
                {message.text}
              </p>
            )}
          </form>
        </section>

        {/* Liste des projets */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10">
          <h2 className="mb-8 font-display text-2xl font-bold tracking-tight text-white">
            Projets publiés
          </h2>

          {isLoadingProjects ? (
            <div className="flex justify-center py-10" role="status" aria-label="Chargement">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-400" />
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
              <p className="text-sm text-gray-400">Aucun projet pour le moment. Ajoutez le premier ci-dessus.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {projects.map((project) => {
                const isPending = pendingDeleteId === project.id;
                return (
                  <li
                    key={project.id}
                    className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-white/10 hover:bg-white/[0.04] md:flex-row md:items-center"
                  >
                    <div className="flex w-full items-center gap-4 md:w-auto">
                      {project.image_url ? (
                        <img src={project.image_url} alt="" className="h-14 w-20 shrink-0 rounded-xl border border-white/10 object-cover object-top" />
                      ) : (
                        <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[10px] text-gray-500">
                          Sans image
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">
                          {project.title}
                          {project.featured && (
                            <span className="ml-3 rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-normal text-violet-300">
                              À la une
                            </span>
                          )}
                        </h3>
                        <p className="mt-1 line-clamp-1 max-w-md text-sm text-gray-500">{project.description}</p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-end gap-3 md:w-auto">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-300 md:flex-none"
                      >
                        Modifier
                      </button>
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="flex-1 rounded-xl border border-red-400/40 bg-red-500/15 px-5 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/25 md:flex-none"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setPendingDeleteId(null)}
                            className="rounded-xl px-3 py-2.5 text-sm text-gray-400 transition-colors hover:text-white"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setPendingDeleteId(project.id)}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:border-red-400/40 hover:text-red-300 md:flex-none"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}