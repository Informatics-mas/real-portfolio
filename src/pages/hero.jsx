import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import MagneticButton from './MagneticButton';
import profilePic from './image/profile.png';

const EASE = [0.22, 1, 0.36, 1];

// Révèle un texte lettre par lettre, masqué par le bas
const RevealText = ({ text, delay = 0, className = '' }) => (
  <span className={`block overflow-hidden pb-[0.08em] ${className}`}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true" className="flex justify-center">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: delay + i * 0.05, ease: EASE }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  </span>
);

const Hero = () => {
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  // --- Halo qui suit la souris ---
  const startX = typeof window !== 'undefined' ? window.innerWidth / 2 - 300 : 0;
  const mx = useMotionValue(startX);
  const my = useMotionValue(120);
  const glowX = useSpring(mx, { stiffness: 70, damping: 20 });
  const glowY = useSpring(my, { stiffness: 70, damping: 20 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left - 300);
    my.set(e.clientY - rect.top - 300);
  };

  // --- Parallaxe : chaque couche bouge à sa propre vitesse pendant le scroll ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 50]);
  const glowParallaxY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={handleMove}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden"
    >
      <motion.div
        aria-hidden="true"
        style={{ y: glowParallaxY }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          style={{ x: glowX, y: glowY }}
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px]"
        />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        {/* Photo hexagonale (monte plus vite que le reste au scroll) */}
        <motion.div style={{ y: photoY }} className="mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative w-40 h-40 md:w-52 md:h-52 group"
          >
            <div className="absolute inset-0 bg-violet-500 rounded-full blur-2xl opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
            <div className="relative w-full h-full bg-gradient-to-tr from-violet-500 to-cyan-400 p-[2px] clip-path-hexagon">
              <div className="w-full h-full bg-[#050505] clip-path-hexagon overflow-hidden">
                <img
                  src={profilePic}
                  alt="Portrait de Ogou David R."
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Le nom */}
        <motion.div style={{ y: titleY }}>
          <h1 className="font-display font-bold tracking-tighter leading-[0.9] text-6xl sm:text-8xl md:text-9xl mb-8">
            <RevealText text="OGOU" delay={0.3} className="text-white" />
            <RevealText text="DAVID R." delay={0.55} className="text-violet-400" />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.3, ease: EASE }}
            className="text-gray-300 text-lg md:text-xl font-light max-w-xl mx-auto mb-2"
          >
            Développeur web.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4, ease: EASE }}
            className="text-gray-500 text-base font-light max-w-md mx-auto mb-12"
          >
            Je crée des sites et applications web sur mesure, de l'interface à la base de données.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6, ease: EASE }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <MagneticButton
            href="#projects"
            className="px-8 py-4 rounded-2xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-400 transition-colors"
          >
            Voir mes projets
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="px-8 py-4 rounded-2xl border border-white/15 text-white text-sm font-semibold hover:border-cyan-400/60 hover:bg-white/5 transition-colors"
          >
            Me contacter
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;