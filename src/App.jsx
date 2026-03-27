import React from 'react';
import Hero from './pages/hero';
import About from './pages/about';
import Projects from './pages/Project';
import Skills from './pages/skills';
import Contact from './pages/contact';
import Footer from './pages/footer';
import './App.css';

export default function App() {
  // On définit l'animation une seule fois et on la passe en "prop" si besoin
  const fadeInUp = { 
    initial: { opacity: 0, y: 30 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: true }, 
    transition: { duration: 0.8 } 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      
      {/* Glows d'arrière-plan fixes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      {/* Rendu des sections modulaires */}
      <Hero fadeInUp={fadeInUp} />
      <About fadeInUp={fadeInUp} />
      <Projects />
      <Skills />
      <Contact />
      <Footer />

    </div>
  );
}