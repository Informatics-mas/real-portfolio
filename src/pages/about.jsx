import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from './safeicon';

const SkillCard = ({ title, icons, description, gradient, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    whileHover={{ y: -10 }}
    className="group relative p-8 rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${gradient} blur-[50px]`} />
    
    <div className="relative z-10">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} p-[1px] mb-6 shadow-lg`}>
        <div className="w-full h-full bg-[#0a0a0a] rounded-[15px] flex items-center justify-center">
          <SafeIcon name={icons} size={28} className="text-white group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-light">
        {description}
      </p>
    </div>
  </motion.div>
);

const About = ({ fadeInUp }) => {
  const skills = [
    {
      title: "Frontend Architecture",
      icons: "Layout",
      description: "Interfaces réactives et performantes avec React, Next.js et Tailwind CSS.",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      title: "Backend Systems",
      icons: "Server",
      description: "Architectures scalables, API RESTful et gestion de bases de données SQL.",
      gradient: "from-purple-600 to-blue-600",
    },
    {
      title: "UI / UX Design",
      icons: "Design",
      description: "Prototypes fiables et design systems centrés sur l'utilisateur.",
      gradient: "from-purple-500 to-pink-500",
    }
  ];

  return (
    <section id="about" className="max-w-7xl mx-auto py-32 px-6">
      <motion.div 
        {...fadeInUp}
        className="glass-card relative p-12 md:p-16 rounded-[48px] border border-white/10 bg-white/[0.01] backdrop-blur-3xl mb-20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-sm font-black tracking-[0.5em] text-cyan-500 uppercase mb-6 flex items-center gap-4">
            <span className="w-8 h-[1px] bg-cyan-500/30"></span>
            Le Profil
          </h2>
          <p className="text-3xl md:text-5xl font-bold text-white leading-[1.1] mb-8 tracking-tighter italic">
            "Code • <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Design • </span> Innovation."
          </p>
          <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
            <p>
              Je transforme vos idées en solutions digitales puissantes, où chaque détail compte et chaque interaction <span className="text-white">marque.</span>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 2. SKILLS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <SkillCard key={index} {...skill} index={index} />
        ))}
      </div>
    </section>
  );
};

export default About;