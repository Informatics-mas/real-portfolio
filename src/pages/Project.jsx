import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './safeicon';
import { supabase } from '../lib/supabaseClient';

const ProjectCard = ({ title, description, tags, demoLink, codeLink, demo_link, code_link, image, index }) => {
  const isPurple = index % 2 === 0;
  const glowColor = isPurple ? 'group-hover:shadow-[0_0_50px_rgba(147,51,234,0.3)]' : 'group-hover:shadow-[0_0_50px_rgba(6,182,212,0.3)]';
  const accentColor = isPurple ? 'from-purple-600 to-blue-600' : 'from-cyan-500 to-blue-500';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group relative p-[1px] rounded-[32px] overflow-hidden bg-white/5 transition-all duration-700 ${glowColor}`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br ${accentColor}`} />

      <div className="relative bg-[#0a0a0a] rounded-[31px] p-8 h-full flex flex-col z-10">
        <div className="relative h-48 mb-8 rounded-2xl bg-[#0f0f0f] border border-white/5 overflow-hidden flex items-center justify-center group-hover:border-cyan-500/20 transition-colors duration-500">
          <div className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-5 group-hover:opacity-10 transition-opacity`} />

          {image ? (
            <img 
              src={image} 
              alt={`Capture d'écran de ${title}`}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
            />
          ) : (
            <SafeIcon name="Layers" size={40} className="text-white/20" />
          )}

          <div className="absolute inset-0 bg-[#0a0a0a]/50 group-hover:bg-transparent transition-colors duration-500" />
          
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[8px] tracking-[0.2em] text-cyan-400 uppercase font-black z-20">
            Featured
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-500 transition-all font-inter tracking-tight">
          {title}
        </h3>
        
        <p className="text-gray-500 font-light text-sm leading-relaxed mb-8 flex-grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-2 mb-10 border-t border-white/5 pt-6">
          {tags && tags.map(tag => (
            <span key={tag} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg text-cyan-400 group-hover:border-cyan-500/30 transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 mt-auto">
          {/* On utilise les variables qui viennent d'être correctement déclarées */}
          <a href={demoLink || demo_link} target="_blank" rel="noopener noreferrer" 
             className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.2em] uppercase text-white hover:text-cyan-400 transition-colors group/link">
            <SafeIcon name="ExternalLink" size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" /> Live Demo
          </a>
          <a href={codeLink || code_link} target="_blank" rel="noopener noreferrer" 
             className="flex items-center gap-2.5 text-[10px] font-black tracking-[0.2em] uppercase text-gray-500 hover:text-purple-400 transition-colors group/link">
            <SafeIcon name="Github" size={14} /> Source Code
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      // 1. On appelle Supabase
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erreur de récupération :", error);
      } else {
        // 2. On met à jour l'état avec les données du cloud
        setProjectData(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="max-w-7xl mx-auto py-32 px-6">
      <div className="flex flex-col mb-24">
        <div className="flex items-center gap-4 mb-4">
          <span className="h-[1px] w-12 bg-cyan-500/50"></span>
          <span className="text-cyan-500 text-[10px] font-black tracking-[0.4em] uppercase">Archive de Travail</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter italic uppercase text-white">
          Projets <span className="text-white/10 font-light group-hover:text-white transition-colors duration-700">Sélectionnés</span>
        </h2>
      </div>

      {/* 3. Affichage Conditionnel : Loader ou Grille de projets */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : projectData.length === 0 ? (
        <p className="text-center text-gray-500">Aucun projet trouvé. Ajoute-en un via le panel admin !</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectData.map((project, index) => (
            <ProjectCard key={project.id} {...project} image={project.image_url} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;