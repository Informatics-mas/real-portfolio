import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [focusedField, setFocusedField] = useState(null);
  const [result, setResult] = useState("");
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSending(true);
    setResult("Transmission en cours...");

    const formData = new FormData(event.target);
    // Ta clé est déjà intégrée ici
    formData.append("access_key", "73b34a12-84e1-46ab-bde0-18d732df7f08");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message reçu avec succès !");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message);
      }
    } catch (error) {
      setResult("Erreur de connexion au serveur.");
    } finally {
      setIsSending(false);
      // Efface le message après 5 secondes
      setTimeout(() => setResult(""), 5000);
    }
  };

  const inputStyle = (field) => `
    w-full bg-white/[0.03] border transition-all duration-500 p-4 rounded-2xl outline-none text-white font-light
    ${focusedField === field 
      ? 'border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] bg-white/[0.07]' 
      : 'border-white/5 hover:border-white/10'}
  `;

  return (
    <section id="contact" className="max-w-4xl mx-auto py-32 px-6">
      <div className="glass-card bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-10 md:p-16 rounded-[45px] relative overflow-hidden">
        
        {/* Glows décoratifs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full" />

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl font-bold mb-4 tracking-tighter italic uppercase">Vous avez un projet? ecrivez-moi //</h2>
          <p className="text-gray-500 tracking-[0.4em] uppercase text-[10px] font-bold">Architecture & Développement</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.3em] text-cyan-400/60 ml-2 uppercase font-black">Nom</label>
              <input 
                type="text" 
                name="name"
                required
                className={inputStyle('name')}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                placeholder="VOTRE NOM"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] tracking-[0.3em] text-cyan-400/60 ml-2 uppercase font-black">Email</label>
              <input 
                type="email" 
                name="email"
                required
                className={inputStyle('email')}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="VOTRE EMAIL"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] tracking-[0.3em] text-purple-400/60 ml-2 uppercase font-black">Message</label>
            <textarea 
              name="message"
              required
              rows="5" 
              className={inputStyle('message')}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              placeholder="DÉCRIVEZ VOTRE PROJET..."
            ></textarea>
          </div>

          <div className="relative">
            <motion.button 
              disabled={isSending}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-sm shadow-xl transition-all
                ${isSending 
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white shadow-[0_10px_40px_rgba(0,0,0,0.3)]'
                }`}
            >
              {isSending ? 'Envoi en cours...' : 'Envoyer votre message'}
            </motion.button>

            {/* Message de statut animé */}
            {result && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-10 left-0 w-full text-center text-[10px] tracking-widest text-cyan-400 uppercase font-bold"
              >
                {result}
              </motion.span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;