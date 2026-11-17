import React, { useEffect, useRef, useState } from 'react';
import { motion, animate, useInView } from 'framer-motion';

// ✏️ Modifie ces valeurs avec tes vrais chiffres
const YEARS_OF_EXPERIENCE = 3;
const PROJECTS_DELIVERED = 5;

const stack = [
  {
    group: 'Interface',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML', 'CSS', 'Framer Motion'],
  },
  {
    group: 'Serveur et données',
    items: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Supabase'],
  },
  {
    group: 'Design',
    items: ['Figma'],
  },
];

// Compte de 0 jusqu'à la valeur quand l'élément devient visible
const Counter = ({ to, suffix = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

const Stat = ({ value, suffix, label }) => (
  <div className="border-t border-white/10 pt-6">
    <p className="font-display text-6xl md:text-7xl font-bold text-white tracking-tighter">
      <Counter to={value} suffix={suffix} />
    </p>
    <p className="text-gray-400 mt-2">{label}</p>
  </div>
);

const Skills = () => (
  <section id="skills" className="max-w-7xl mx-auto py-28 px-6 scroll-mt-20">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
      <div className="lg:col-span-3">
        <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          Technologies
        </h2>
        <p className="text-gray-400 text-lg font-light mb-14 max-w-lg">
          Les outils que j'utilise au quotidien sur mes projets.
        </p>

        <div className="space-y-10">
          {stack.map(({ group, items }, groupIndex) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: groupIndex * 0.08 }}
            >
              <h3 className="text-sm text-gray-500 mb-4">{group}</h3>
              <ul className="flex flex-wrap gap-3">
                {items.map((item) => (
                  <li
                    key={item}
                    className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] text-gray-200 text-sm hover:border-violet-400/50 hover:text-white transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 flex flex-col justify-center gap-12">
        <Stat value={YEARS_OF_EXPERIENCE} suffix=" ans" label="d'expérience en développement web" />
        <Stat value={PROJECTS_DELIVERED} suffix="+" label="projets réalisés et mis en ligne" />
      </div>
    </div>
  </section>
);

export default Skills;