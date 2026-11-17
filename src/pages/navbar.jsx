import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useSpring } from 'framer-motion';

const links = [
  { href: '#about', label: 'Profil' },
  { href: '#projects', label: 'Projets' },
  { href: '#skills', label: 'Stack' },
  { href: '#parcours', label: 'Parcours' },
  { href: '#contact', label: 'Contact' },
];

const Navbar = () => {
  const [hidden, setHidden] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // Se cache quand on descend, réapparaît quand on remonte
  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(y > previous && y > 120);
  });

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 bg-[#050505]/70 backdrop-blur-xl border-b border-white/5"
    >
      <nav
        aria-label="Navigation principale"
        className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between"
      >
        <a href="#top" className="font-display font-bold text-white tracking-tight text-lg">
          DR<span className="text-violet-400">.</span>
        </a>

        <ul className="flex items-center gap-3 sm:gap-5 md:gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs sm:text-sm text-gray-400 hover:text-white focus-visible:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Barre de progression de lecture */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-violet-400"
      />
    </motion.header>
  );
};

export default Navbar;