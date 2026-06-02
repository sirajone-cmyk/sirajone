import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { sifaatColors } from '../lib/lettersData';

export default function LetterDrawer({ letter, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {letter && (
        <>
          <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <motion.div key="drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-slate-900 border-l border-white/10 overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-bold text-white">{letter.arabic}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{letter.name}</h2>
                  <p className="text-slate-400 text-sm">{letter.sifaat.length} Sifaat</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-emerald-400 font-semibold uppercase text-xs tracking-widest mb-2">Makhraj (Articulation Point)</h3>
                <p className="text-slate-200 leading-relaxed">{letter.makhraj}</p>
              </div>
              <div>
                <h3 className="text-emerald-400 font-semibold uppercase text-xs tracking-widest mb-3">Sifaat (Qualities)</h3>
                <div className="flex flex-wrap gap-2">
                  {letter.sifaat.map(s => (
                    <span key={s} className={`px-3 py-1.5 rounded-full text-sm font-medium ${sifaatColors[s] || 'bg-gray-100 text-gray-700'}`}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
