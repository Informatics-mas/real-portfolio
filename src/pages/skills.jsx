import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ name, level, isPurple }) => (
  <div className="mb-8">
    <div className="flex justify-between mb-3 text-[10px] font-black tracking-[0.3em] uppercase">
      <span className="text-gray-400">{name}</span>
      <span className={isPurple ? "text-purple-400" : "text-cyan-400"}>{level}%</span>
    </div>
    <div className="h-[3px] w-full bg-white/5 rounded-full relative overflow-hidden">
      {/* Barre de progression avec dégradé et lueur */}
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`absolute h-full rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] bg-gradient-to-r ${
          isPurple ? "from-purple-600 to-blue-500" : "from-cyan-500 to-blue-400"
        }`}
      >
        {/* Effet Shimmer (Brillance qui passe) */}
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full"
        />
      </motion.div>
    </div>
  </div>
);

const CircularMetric = ({ value, label, sublabel, index }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="relative group flex flex-col items-center"
  >
    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white/5 flex items-center justify-center relative mb-6 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]">
      {/* Cercle de progression SVG */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle 
          cx="50%" cy="50%" r="48%" 
          className="stroke-white/5 fill-none" 
          strokeWidth="1"
        />
        <motion.circle 
          cx="50%" cy="50%" r="48%" 
          className="stroke-cyan-500 fill-none" 
          strokeWidth="2"
          strokeDasharray="100 100"
          initial={{ strokeDashoffset: 100 }}
          whileInView={{ strokeDashoffset: 20 }} // Simule 80%
          transition={{ duration: 2, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center z-10">
        <span className="text-3xl md:text-4xl font-black text-white tracking-tighter italic">{value}</span>
      </div>
    </div>
    <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">{label}</span>
    <span className="text-[8px] text-cyan-500/40 tracking-widest mt-1 uppercase">{sublabel}</span>
  </motion.div>
);

const Skills = () => {
  return (
    <section className="max-w-7xl mx-auto py-32 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        
        {/* PARTIE GAUCHE : PROGRESS BARS */}
        <div>
          <div className="mb-16">
            <h2 className="text-sm font-black tracking-[0.6em] text-purple-500 uppercase mb-4 italic">Capacité Technique //</h2>
            <h3 className="text-4xl md:text-6xl font-bold tracking-tighter">Stack de <span className="text-white/20">Puissance</span></h3>
          </div>
          
          <div className="space-y-4">
            <ProgressBar name="React " level={25} isPurple={false} />
            <ProgressBar name="Node.js " level={20} isPurple={true} />
            <ProgressBar name="CSS" level={50} isPurple={false} />
            <ProgressBar name="Figma" level={15} isPurple={true} />
            <ProgressBar name="HTML" level={70} isPurple={false} />
            <ProgressBar name="Tailwind CSS" level={20} isPurple={true} />
          </div>
        </div>

        {/* PARTIE DROITE : CIRCULAR METRICS */}
        <div className="grid grid-cols-2 gap-12">
          <CircularMetric value="02" label="Années" sublabel="Expérience" index={0} />
          <CircularMetric value="plusieurs" label="Projets" sublabel="réalisés" index={1} />
        </div>

      </div>
    </section>
  );
};

export default Skills;