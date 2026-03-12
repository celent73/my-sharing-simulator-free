import React from 'react';

interface LegalFooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookie') => void;
}

const LegalFooter: React.FC<LegalFooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full py-12 px-6 bg-footer-dynamic border-t border-slate-800 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl opacity-80">
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <button onClick={() => onOpenLegal('terms')} className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold transition-colors">Termini</button>
          <button onClick={() => onOpenLegal('privacy')} className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold transition-colors">Privacy</button>
          <button onClick={() => onOpenLegal('cookie')} className="text-[10px] text-white/40 hover:text-white/70 uppercase tracking-widest font-bold transition-colors">Cookie</button>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright e Versione */}
          <div className="text-left">
            <p className="font-semibold text-white">
              Tutti i diritti riservati © {new Date().getFullYear()} - My Sharing Simulator v1.2.76
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Applicazione indipendente non affiliata o sponsorizzata da terze parti.
            </p>
          </div>

          <div className="text-xs font-mono text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-md">
            v1.2.76 - Protetto da crittografia SSL a 256 bit 🔒
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;