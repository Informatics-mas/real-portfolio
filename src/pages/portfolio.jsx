import React, { useState, useEffect } from 'react';
import Hero from './hero';
import About from './about';
import Projects from './Project';
import Skills from './skills';
import Contact from './contact';
import Footer from './footer';
import { supabase } from '../lib/supabaseClient';
import '../App.css'; 

export default function Portfolio() {

  useEffect(() => {
        const trackView = async () => {
        await supabase.from('page_views').insert([{}]);
        };
        trackView();
    }, []);

  const fadeInUp = { 
    initial: { opacity: 0, y: 30 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: true }, 
    transition: { duration: 0.8 } 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Hero fadeInUp={fadeInUp} />
        <About fadeInUp={fadeInUp} />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}