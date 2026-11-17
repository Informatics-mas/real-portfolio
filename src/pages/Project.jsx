import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import SafeIcon from './safeicon';
import { supabase } from '../lib/supabaseClient';

const MAX_TILT = 7; // degrés d'inclinaison maximum au survol

const ProjectCard = ({
  title,
  description,
  tags,
  demoLink,
  codeLink,
  demo_link,
  code_link,
  image,
  featured,
  index,
}) => {
  const demo = demoLink || demo_link;
  const code = codeLink || code_link;
  const isLead = index === 0; // le premier projet occupe toute la largeur
  const reduce = useReducedMotion();

  // --- Inclinaison 3D + reflet qui suit la souris ---
  const rotateXRaw = useMotionValue(0);
  const rotateYRaw = useMotionValue(0);
  const rotateX = useSpring(rotateXRaw, { stiffness: 160, damping: 18 });
  const rotateY = useSpring(rotateYRaw, { stiffness: 160, damping: 18 });
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, rgba(167,139,250,0.14), transparent 60%)`;

  const handleMove = (e) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateYRaw.set((px - 0.5) * MAX_TILT * 2);
    rotateXRaw.set(-(py - 0.5) * MAX_TILT * 2);
    glowX.set(px * 100);
    glowY.set(py * 100);
  };

  const handleLeave = () => {
    rotateXRaw.set(0);
    rotateYRaw.set(0);
  };

  // --- Parallaxe de la capture pendant le scroll ---
  const imageBoxRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: imageBoxRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%']);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={`group relative flex flex-col rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8 transition-colors duration-500 hover:border-violet-400/40 ${
        isLead ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Reflet lumineux */}
      <motion.div
        aria-hidden="true"
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div
        ref={imageBoxRef}
        className={`relative mb-6 overflow-hidden rounded-2xl border border-white/5 bg-[#0f0f0f] flex items-center justify-center ${
          isLead ? 'h-56 md:h-96' : 'h-48 md:h-56'
        }`}
      >
        {image ? (
          <motion.div style={{ y: imageY, scale: 1.15 }} className="absolute inset-0">
            <img
              src={image}
              alt={`Capture d'écran de ${title}`}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
          </motion.div>
        ) : (
          <SafeIcon name="Layers" size={40} className="text-white/20" />
        )}

        {featured && (
          <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-xs text-violet-300 font-medium">
            À la une
          </span>
        )}
      </div>

      <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>

      {description && (
        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{description}</p>
      )}

      {tags?.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-8 mt-auto">
          {tags.map((tag) => (
            <li
              key={tag}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-gray-300"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-5">
        {demo ? (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
          >
            <SafeIcon name="ExternalLink" size={14} /> Voir la démo
          </a>
        ) : (
          <span />
        )}
        {code && (
          <a
            href={code}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-2 text-sm text-gray-400 hover:text-violet-300 transition-colors"
          >
            <SafeIcon name="Github" size={14} /> Code source
          </a>
        )}
      </div>
    </motion.article>
  );
};

const Projects = () => {
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur de récupération :', error);
        setHasError(true);
      } else {
        setProjectData(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="max-w-7xl mx-auto py-28 px-6 scroll-mt-20">
      <div className="mb-16">
        <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Projets sélectionnés
        </h2>
        <p className="text-gray-400 text-lg font-light max-w-lg">
          Des applications réelles, de la conception à la mise en ligne.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20" role="status" aria-label="Chargement">
          <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
        </div>
      ) : hasError ? (
        <p className="text-center text-gray-400">
          Impossible de charger les projets. Rechargez la page pour réessayer.
        </p>
      ) : projectData.length === 0 ? (
        <p className="text-center text-gray-400">Les premiers projets arrivent bientôt.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {projectData.map((project, index) => (
            <ProjectCard key={project.id} {...project} image={project.image_url} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;