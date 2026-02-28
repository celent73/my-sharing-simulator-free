import React, { useState } from 'react';

interface QuickNavigationProps {
  sections: Array<{
    id: string;
    name: string;
    icon: string;
  }>;
}

const QuickNavigation: React.FC<QuickNavigationProps> = ({ sections }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsExpanded(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsExpanded(false);
  };

  return (
    <>
      {/* Floating Navigation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded && (
          <div className="mb-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 p-4 animate-[slideUp_0.3s_ease-out] max-h-[70vh] overflow-y-auto">
            <div className="space-y-2 min-w-[250px]">
              {/* Scroll to Top */}
              <button
                onClick={scrollToTop}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-union-orange-500 to-red-500 hover:from-union-orange-600 hover:to-red-600 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-md"
              >
                <span className="text-xl">⬆️</span>
                <span>Torna su</span>
              </button>

              <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>

              {/* Section Links */}
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all hover:scale-105"
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="text-left text-sm">{section.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-4 bg-gradient-to-r from-union-blue-500 to-purple-500 hover:from-union-blue-600 hover:to-purple-600 text-white rounded-full shadow-2xl transition-all ${
            isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
          }`}
          title="Menu Navigazione Rapida"
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default QuickNavigation;
