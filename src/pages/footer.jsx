import React from 'react';
import SafeIcon from './safeicon';

const SocialIcon = ({ name, link, isCyan, label }) => (
  <div className="flex flex-col items-center gap-2 group">
    <a 
      href={link || "#"} 
      target={link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className={`p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-all duration-500 hover:-translate-y-2
        ${isCyan 
          ? 'hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
          : 'hover:text-purple-400 hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)]'
        }`}
    >
      <SafeIcon name={name} size={22} />
    </a>
    {label && (
      <span className="text-[10px] font-mono tracking-widest text-gray-500 group-hover:text-white transition-colors uppercase">
        {label}
      </span>
    )}
  </div>
);

const Footer = () => (
  <footer className="py-24 text-center border-t border-white/5 relative z-10 bg-[#050505]">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
        
        <div className="flex gap-4">
            <SocialIcon name="Github" link="https://github.com/Informatics-mas" isCyan={true} />
            <SocialIcon name="Linkedin" link="https://www.linkedin.com/in/david-ogou-b18200321" isCyan={false} />
            <SocialIcon name="Mail" link="mailto:ogouogoudavid@gmail.com" isCyan={true} />
            <SocialIcon name="Briefcase" link="https://upwork.com/freelancers/~016468257a0b04344a" isCyan={false} /> 
        </div>

        <div className="flex flex-wrap justify-center gap-8">
            <SocialIcon name="MapPin" label="Anyama, CI" isCyan={true} />
            <SocialIcon name="Phone" label="05-01-36-85-46" isCyan={false} />
        </div>
    </div>

    <div className="opacity-40 hover:opacity-100 transition-opacity duration-700">
        <p className="text-gray-500 text-[9px] font-mono tracking-[0.5em] uppercase mb-2">
         © 2026 • Ogou David R.
        </p>
        <div className="flex justify-center items-center gap-2 text-[8px] text-cyan-500/50 tracking-widest uppercase">
            <span className="w-8 h-[1px] bg-cyan-500/20"></span>
            Développeur Full Stack • Tous droits réservés
            <span className="w-8 h-[1px] bg-cyan-500/20"></span>
        </div>
    </div>
  </footer>
);

export default Footer;