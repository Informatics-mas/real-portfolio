import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './safeicon';
import RevealHeading from './RevealHeading';

const skills = [
  {
    title: 'Interfaces web',
    icon: 'Layout',
    description: 'Des interfaces rapides et réactives avec React, Next.js et Tailwind CSS.',
  },
  {
    title: 'Serveur et données',
    icon: 'Server',
    description: 'Des API REST, des bases de données SQL et NoSQL, et une authentification sécurisée.',
  },
  {
    title: 'Design UI / UX',
    icon: 'Design',
    description: 'Des maquettes Figma et des composants cohérents, pensés pour l\'utilisateur.',
  },
];

const SkillCard = ({ title, icon, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-violet-400/40 transition-colors duration-500"
  >
    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center mb-6">
      <SafeIcon name={icon} size={24} className="text-violet-300" />
    </div>
    <h3 className="font-display text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const About = ({ fadeInUp }) => (
  <section id="about" className="max-w-7xl mx-auto py-28 px-6 scroll-mt-20">
    <motion.div {...fadeInUp} className="max-w-3xl mb-16">
      <RevealHeading className="font-display text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">Du code propre, un design soigné, des idées qui deviennent des produits.</RevealHeading>
      <p className="text-gray-400 text-lg font-light leading-relaxed max-w-2xl">
        Je transforme vos idées en produits web fiables : une interface claire pour vos visiteurs
        et une base solide en coulisses.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
        <SkillCard key={skill.title} {...skill} index={index} />
      ))}
    </div>
  </section>
);

export default About;