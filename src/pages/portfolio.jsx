import React, { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import Lenis from 'lenis';
import Navbar from './navbar';
import Hero from './hero';
import About from './about';
import Projects from './Project';
import Skills from './skills';
import Parcours from './parcours';
import Contact from './contact';
import Footer from './footer';
import { supabase } from '../lib/supabaseClient';
import '../App.css';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export default function Portfolio() {
  // Compte une seule visite par session (évite les doublons au rechargement)
  useEffect(() => {
    try {
      if (sessionStorage.getItem('portfolio_viewed')) return;
      sessionStorage.setItem('portfolio_viewed', '1');
    } catch {
      /* stockage indisponible : on compte quand même */
    }
    supabase.from('page_views').insert([{}]).then(({ error }) => {
      if (error) console.error('Suivi des visites :', error);
    });
  }, []);

  // Défilement fluide (Lenis), désactivé si l'appareil demande moins d'animations
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -64 } });
    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return (
    // reducedMotion="user" : désactive les animations de mouvement si l'appareil le demande
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#050505] text-white selection:bg-violet-500/30">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <About fadeInUp={fadeInUp} />
            <Projects />
            <Skills />
            <Parcours />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}