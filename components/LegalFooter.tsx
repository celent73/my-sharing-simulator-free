import React from 'react';

interface LegalFooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookie') => void;
}

const LegalFooter: React.FC<LegalFooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="w-full py-12 px-6 bg-footer-dynamic border-t border-slate-800 flex flex-col items-center justify-center text-center">
      <div className="max-w-4xl opacity-80">
        <div className="flex justify-center mb-6">
          <img 
            src="/union_logo_footer.jpg" 
            alt="Union Energia" 
            className="h-10 w-auto opacity-60 hover:opacity-100 transition-opacity drop-shadow-sm" 
          />
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-6">
          <button onClick={() => onOpenLegal('terms')} className="text-[10px] uppercase tracking-widest font-bold transition-colors opacity-40 hover:opacity-70" style={{ color: 'var(--footer-text)' }}>Termini</button>
          <button onClick={() => onOpenLegal('privacy')} className="text-[10px] uppercase tracking-widest font-bold transition-colors opacity-40 hover:opacity-70" style={{ color: 'var(--footer-text)' }}>Privacy</button>
          <button onClick={() => onOpenLegal('cookie')} className="text-[10px] uppercase tracking-widest font-bold transition-colors opacity-40 hover:opacity-70" style={{ color: 'var(--footer-text)' }}>Cookie</button>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright e Versione */}
          <div className="text-left">
            <p className="font-semibold" style={{ color: 'var(--footer-text)' }}>
              Tutti i diritti riservati © 2026 Union Energia - My Sharing Simulator • v1.3.27
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 uppercase tracking-tighter">
              App Ufficiale Union Energia. Proprietà Intellettuale di Luca Celentano (L.C.)
            </p>
          </div>

          <div className="text-xs font-mono text-gray-600 dark:text-gray-200 bg-gray-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-md">
            v1.3.27 - Protetto da crittografia SSL a 256 bit 🔒
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LegalFooter;