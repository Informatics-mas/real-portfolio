import React from 'react';
import { motion } from 'framer-motion';
import profilePic from './image/profile.png';

const Hero = ({ fadeInUp }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      
      {/* 1. ANIMATED BACKGROUND ORBS */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.3, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* 2. HEXAGONAL IMAGE WITH NEON GRADIENT */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "backOut" }}
          className="relative w-48 h-48 md:w-64 md:h-64 mb-12 group"
        >
          {/* Neon Glow Background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-cyan-400 rounded-full blur-2xl opacity-20 group-hover:opacity-60 transition-opacity duration-700" />
          
          {/* Hexagon Mask */}
          <div className="relative w-full h-full bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] clip-path-hexagon">
            <div className="w-full h-full bg-[#050505] clip-path-hexagon overflow-hidden">
              <img 
                src={profilePic}
                alt="Ogou David R."
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
              />
            </div>
          </div>
        </motion.div>

        {/* 3. NAME WITH GRADIENT TEXT */}
        <motion.h1 
          {...fadeInUp}
          className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-center"
        >
          OGOU<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 drop-shadow-[0_0_30px_rgba(147,51,234,0.3)]">
            DAVID R.
          </span>
        </motion.h1>

        {/* 4. TAGLINE WITH DECORATIVE DOTS */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
          <p className="text-gray-400 text-xs md:text-sm tracking-[0.5em] uppercase font-bold">
            Full Stack Developer <span className="text-white/20 mx-2"></span> 
          </p>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </motion.div>

        {/* 5. CTA BUTTONS (GLASSMORPHISM) */}
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row gap-6"
        >
          <a href="#projects" className="px-10 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl font-black tracking-widest text-[10px] uppercase hover:bg-white/10 hover:border-cyan-500/50 transition-all shadow-xl group flex items-center gap-3">
            Explorer les Projets
            <span className="w-2 h-[1px] bg-cyan-500 group-hover:w-4 transition-all" />
          </a>
          <a href="#contact" className="px-10 py-4 bg-gradient-to-r from-purple-600/20 to-cyan-500/20 backdrop-blur-md border border-purple-500/30 rounded-2xl font-black tracking-widest text-[10px] uppercase hover:border-purple-500 transition-all text-purple-200">
            Démarrer un Projet
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;