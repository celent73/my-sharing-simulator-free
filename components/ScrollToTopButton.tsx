import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostra il pulsante solo se scorri giù di 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-[120] p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-xl shadow-black/30 border border-slate-600 transition-all duration-300 hover:-translate-y-1 group"
      title="Torna su"
    >
      <ArrowUp size={24} className="group-hover:animate-bounce" />
    </button>
  );
};