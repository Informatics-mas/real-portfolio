import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from './safeicon';
import RevealHeading from './RevealHeading';

// ✏️ Réglages faciles à modifier
const ACCESS_KEY = '73b34a12-84e1-46ab-bde0-18d732df7f08'; // clé publique Web3Forms
const EMAIL = 'ogouogoudavid@gmail.com';
const WHATSAPP_URL = 'https://wa.me/2250501368546';
const LOCATION = "Anyama, Côte d'Ivoire";
const RESPONSE_TIME = 'sous 48 h';
const IS_AVAILABLE = true; // passe à false pour masquer « Disponible pour de nouveaux projets »
const MAX_MESSAGE = 1000;

const PROJECT_TYPES = ['Site vitrine', 'Application web', 'Refonte', 'Autre'];

const EASE = [0.22, 1, 0.36, 1];

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white placeholder-gray-500 outline-none transition-all duration-300 hover:border-white/20 focus:border-cyan-400/70 focus:bg-white/[0.05] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.08)]';

const Label = ({ htmlFor, children, optional }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-2">
    {children}
    {optional && <span className="text-gray-500 font-normal"> (facultatif)</span>}
  </label>
);

const ContactLink = ({ icon, label, value, href }) => {
  const content = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 transition-colors group-hover:border-violet-400/50 group-hover:text-violet-300">
        <SafeIcon name={icon} size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-gray-500">{label}</span>
        <span className="block text-gray-200 truncate">{value}</span>
      </span>
    </>
  );

  return href ? (
    <a
      href={href}
      {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-center gap-4"
    >
      {content}
    </a>
  ) : (
    <div className="group flex items-center gap-4">{content}</div>
  );
};

const SuccessPanel = ({ onReset }) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.5, ease: EASE }}
    className="flex flex-col items-center justify-center text-center py-16 px-4"
    role="status"
  >
    <motion.svg viewBox="0 0 52 52" fill="none" className="w-20 h-20 mb-8" aria-hidden="true">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        stroke="#A78BFA"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M15 27l8 8 15-16"
        stroke="#A78BFA"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>

    <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
      Message envoyé
    </h3>
    <p className="text-gray-400 max-w-sm mb-8">
      Merci pour votre message. Je vous réponds {RESPONSE_TIME} à l'adresse que vous avez indiquée.
    </p>
    <button
      type="button"
      onClick={onReset}
      className="text-sm font-semibold text-violet-300 hover:text-white transition-colors"
    >
      Envoyer un autre message
    </button>
  </motion.div>
);

const Contact = () => {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const [messageLength, setMessageLength] = useState(0);

  const isSending = status === 'sending';

  const onSubmit = async (event) => {
    event.preventDefault();
    if (isSending) return;

    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    formData.append('access_key', ACCESS_KEY);
    formData.append('subject', 'Nouveau message depuis le portfolio');
    formData.append('from_name', 'Portfolio');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessageLength(0);
      } else {
        console.error('Web3Forms :', data);
        setErrorMessage(data.message || "Le message n'a pas pu être envoyé.");
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Connexion impossible. Vérifiez votre connexion internet et réessayez.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="max-w-6xl mx-auto py-28 px-6 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-14 lg:gap-16">
        {/* Colonne gauche : accroche + contacts directs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="lg:col-span-2"
        >
          {IS_AVAILABLE && (
            <p className="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-1.5 text-sm text-emerald-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Disponible pour de nouveaux projets
            </p>
          )}

          <RevealHeading className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.05] mb-5">Parlons de votre projet</RevealHeading>
          <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-md">
            Décrivez votre besoin en quelques lignes. Je vous réponds {RESPONSE_TIME}.
          </p>

          <div className="space-y-5">
            <ContactLink icon="Mail" label="Email" value={EMAIL} href={`mailto:${EMAIL}`} />
            <ContactLink icon="Whatsapp" label="WhatsApp" value="Écrire directement" href={WHATSAPP_URL} />
            <ContactLink icon="MapPin" label="Localisation" value={LOCATION} />
          </div>
        </motion.div>

        {/* Colonne droite : formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="lg:col-span-3 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-10"
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <SuccessPanel key="success" onReset={() => setStatus('idle')} />
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Anti-spam Web3Forms : champ invisible que seuls les robots remplissent */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact-name">Nom</Label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Votre nom"
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="vous@exemple.com"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <fieldset>
                  <legend className="block text-sm font-medium text-gray-300 mb-3">
                    Type de projet <span className="text-gray-500 font-normal">(facultatif)</span>
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {PROJECT_TYPES.map((type) => (
                      <label key={type} className="cursor-pointer">
                        <input type="radio" name="project_type" value={type} className="peer sr-only" />
                        <span className="inline-block rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition-all duration-300 hover:border-white/25 peer-checked:border-violet-400 peer-checked:bg-violet-500/15 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-violet-400">
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <div className="flex items-baseline justify-between">
                    <Label htmlFor="contact-message">Message</Label>
                    <span className="text-xs text-gray-500 tabular-nums">
                      {messageLength}/{MAX_MESSAGE}
                    </span>
                  </div>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    maxLength={MAX_MESSAGE}
                    onChange={(e) => setMessageLength(e.target.value.length)}
                    placeholder="Décrivez votre projet, vos objectifs et vos délais…"
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <div>
                  <motion.button
                    type="submit"
                    disabled={isSending}
                    whileTap={{ scale: 0.985 }}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-violet-500 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-violet-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
                  >
                    {isSending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Envoi en cours…
                      </>
                    ) : (
                      'Envoyer le message'
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        role="alert"
                        className="mt-4 rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
                      >
                        {errorMessage} Vous pouvez aussi m'écrire directement à{' '}
                        <a href={`mailto:${EMAIL}`} className="underline hover:text-white">
                          {EMAIL}
                        </a>
                        .
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;