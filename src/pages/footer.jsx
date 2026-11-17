import React from 'react';
import SafeIcon from './safeicon';

const SocialLink = ({ name, href, label, external = true }) => (
  <a
    href={href}
    aria-label={label}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:border-violet-400/50"
  >
    <SafeIcon name={name} size={20} />
  </a>
);

const Footer = () => (
  <footer className="relative z-10 border-t border-white/5 bg-[#050505] py-16">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="text-center md:text-left">
        <p className="font-display text-xl font-bold text-white tracking-tight">Ogou David R.</p>
        <p className="text-gray-400 text-sm mt-1">Développeur full stack, Anyama (Côte d'Ivoire)</p>
      </div>

      <div className="flex gap-3">
        <SocialLink name="Github" label="GitHub" href="https://github.com/Informatics-mas" />
        <SocialLink
          name="Linkedin"
          label="LinkedIn"
          href="https://www.linkedin.com/in/david-ogou-b18200321"
        />
        <SocialLink
          name="Upwork"
          label="Upwork"
          href="https://upwork.com/freelancers/~016468257a0b04344a"
        />
        <SocialLink
          name="Whatsapp"
          label="Écrire sur WhatsApp"
          href="https://wa.me/2250501368546"
        />
        <SocialLink
          name="Mail"
          label="Envoyer un email"
          href="mailto:ogouogoudavid@gmail.com"
          external={false}
        />
      </div>
    </div>

    <p className="text-center text-gray-500 text-xs mt-12">© 2026 Ogou David R. Tous droits réservés.</p>
  </footer>
);

export default Footer;