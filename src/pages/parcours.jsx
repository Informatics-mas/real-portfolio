import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import SafeIcon from './safeicon';
import RevealHeading from './RevealHeading';

// ✏️ MODIFIE CETTE LISTE avec ton vrai parcours (du plus récent au plus ancien).
// Ajoute, retire ou réordonne les blocs librement. `tags` est facultatif.
const parcours = [
  {
    period: '2025',
    type: 'Diplôme',
    title: 'BTS en Informatique Developpeur d\'Applications (BTS IDA)',
    place: "Institut de Formation Sainte Marie (IFSM)",
    city: 'Abidjan, Côte d\'Ivoire',
    description: ' Brevet de Technicien Supérieur en Informatique, option Développeur d\'Applications. Formation axée sur le développement',
  },
  {
    period: '2021 – 2022',
    type: 'Diplôme',
    title: 'BAC D',
    place: "Lycée Moderne d'anyama",
    city: 'Abidjan, Côte d\'Ivoire',
    description: 'baccalauréat scientifique, option D. Formation axée sur les sciences et les mathématiques.',
  },
  {
    period: '2018 – 2019',
    type: 'Diplôme',
    title: 'Brevet d\'Etudes du Premier Cycle (BEPC)',
    place: 'Lycée moderne Alassane ouattara d\'anyama(LYMAO)',
    description: 'Brevet d\'Etudes du Premier Cycle. Formation axée sur les matières générales et scientifiques.',
  },
];

const TimelineItem = ({ period, type, title, place, city, description, tags, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -24 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
    className="relative"
  >
    {/* Point sur la ligne */}
    <span
      aria-hidden="true"
      className="absolute -left-8 md:-left-12 top-2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#050505] border-2 border-violet-400"
    />

    <div className="flex flex-wrap items-center gap-3 mb-3">
      <span className="text-sm font-medium text-violet-300">{period}</span>
      <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] text-gray-300">
        {type}
      </span>
    </div>

    <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight mb-1">
      {title}
    </h3>
    <p className="text-gray-300 mb-3">
      {place}
      {city && <span className="text-gray-500">, {city}</span>}
    </p>

    {description && (
      <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">{description}</p>
    )}

    {tags?.length > 0 && (
      <ul className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag) => (
          <li
            key={tag}
            className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-gray-300"
          >
            {tag}
          </li>
        ))}
      </ul>
    )}
  </motion.li>
);

const Parcours = () => {
  const trackRef = useRef(null);

  // La ligne violette se remplit pendant qu'on fait défiler la frise
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 75%', 'end 60%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="parcours" className="max-w-7xl mx-auto py-28 px-6 scroll-mt-20">
      <div className="mb-16 flex items-start gap-4">
        <div className="hidden sm:flex w-12 h-12 shrink-0 rounded-xl bg-violet-500/10 border border-violet-400/20 items-center justify-center mt-1">
          <SafeIcon name="Graduation" size={22} className="text-violet-300" />
        </div>
        <div>
          <RevealHeading className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            Parcours scolaire
          </RevealHeading>
          <p className="text-gray-400 text-lg font-light max-w-lg">
            Les formations et diplômes qui m'ont mené au développement web.
          </p>
        </div>
      </div>

      <div ref={trackRef} className="relative max-w-3xl pl-8 md:pl-12">
        {/* Ligne de fond + ligne qui se remplit */}
        <div aria-hidden="true" className="absolute left-0 top-2 bottom-2 w-px bg-white/10" />
        <motion.div
          aria-hidden="true"
          style={{ scaleY: fill }}
          className="absolute left-0 top-2 bottom-2 w-px origin-top bg-violet-400"
        />

        <ol className="space-y-14">
          {parcours.map((item, index) => (
            <TimelineItem key={`${item.title}-${index}`} {...item} index={index} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Parcours;