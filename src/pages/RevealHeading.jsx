import React from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

// Titre dont les mots remontent un à un quand il entre à l'écran.
// Usage : <RevealHeading className="...">Mon titre</RevealHeading>
const RevealHeading = ({ children, className = '', as: Tag = 'h2' }) => {
  const words = String(children).trim().split(/\s+/);

  return (
    <Tag className={className}>
      {/* Version lisible par les lecteurs d'écran */}
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <React.Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
              <motion.span
                className="inline-block"
                initial={{ y: '110%' }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </span>
    </Tag>
  );
};

export default RevealHeading;