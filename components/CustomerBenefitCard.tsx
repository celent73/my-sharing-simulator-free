import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface CustomerBenefitCardProps {
  totalRecurringYear1: number; // Guadagno totale potenziale di un Family Utility
  monthlyCashback: number; // Cashback mensile
}

const CustomerBenefitCard: React.FC<CustomerBenefitCardProps> = ({ totalRecurringYear1, monthlyCashback }) => {
  const { t } = useLanguage();

  // Il guadagno di un cliente che fa rete è lo STESSO di quello di un Family Utility
  const customerPotentialEarnings = totalRecurringYear1;

  const scrollToInput = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-500 to-teal-600 text-white rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 overflow-hidden relative mt-8 group hover:scale-[1.01] transition-transform duration-300">

      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-900/20 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10"></div>

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-8">
        <div className="w-14 h-14 flex items-center justify-center bg-white/20 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30 text-3xl">
          🛡️
        </div>
        <div>
          <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest mb-1 border border-white/20">
            {t('customer_benefit.tag')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            {t('customer_benefit.title')}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">

        {/* Section 1: Cashback */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              🛍️ {t('customer_benefit.cashback_title')}
            </h3>
            <p className="text-sm text-cyan-50 opacity-90 leading-relaxed mb-4">
              {t('customer_benefit.cashback_desc')}
            </p>
          </div>

          <div className="mt-auto">
            <div className="flex justify-between items-end mb-1">
              <span className="text-xs uppercase font-bold opacity-70">{t('customer_benefit.your_saving')}</span>
              <span className="text-2xl font-extrabold">{monthlyCashback > 0 ? `€${monthlyCashback.toFixed(2)} ` : '€0'}</span>
            </div>
            <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000"
                style={{ width: monthlyCashback > 0 ? '100%' : '5%' }}
              ></div>
            </div>
            {monthlyCashback === 0 && (
              <button
                onClick={scrollToInput}
                className="mt-3 text-xs font-bold underline decoration-white/50 hover:decoration-white transition-all"
              >
                {t('customer_benefit.simulate_cashback')}
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Network Comparison */}
        <div className="bg-white rounded-2xl p-5 text-gray-800 shadow-lg relative overflow-hidden">
          <h3 className="text-lg font-bold mb-2 text-teal-700">
            🗣️ {t('customer_benefit.network_title')}
          </h3>
          <p className="text-sm text-gray-600 mb-6 leading-snug">
            {t('customer_benefit.network_desc')}
          </p>

          <div className="flex gap-2 items-end h-32">
            {/* Family Bar */}
            <div className="flex-1 flex flex-col items-center gap-1 opacity-50 grayscale hover:grayscale-0 transition-all duration-300 h-full justify-end">
              <span className="text-[10px] font-bold uppercase text-gray-400">Family Utility</span>
              <div className="w-full bg-gray-200 rounded-t-lg h-full relative overflow-hidden">
                <div className="absolute bottom-0 w-full bg-union-blue-500 h-full"></div>
              </div>
              <span className="text-xs font-bold text-gray-500">€{totalRecurringYear1.toLocaleString('it-IT')}</span>
            </div>

            {/* VS */}
            <div className="font-black text-gray-300 text-xl pb-8">vs</div>

            {/* Customer Bar */}
            <div className="flex-1 flex flex-col items-center gap-1 scale-105 origin-bottom h-full justify-end">
              <div className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 border border-teal-200 animate-bounce">
                TU
              </div>
              <div className="w-full bg-teal-100 rounded-t-lg h-full relative overflow-hidden shadow-inner border-x border-t border-teal-200">
                <div className="absolute bottom-0 w-full bg-teal-500 h-full"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg drop-shadow-md">
                  100%
                </div>
              </div>
              <span className="text-sm font-extrabold text-teal-600">€{customerPotentialEarnings.toLocaleString('it-IT')}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-6 border-t border-white/20 text-center relative z-10">
        <p className="text-sm sm:text-base font-medium text-cyan-50">
          {t('customer_benefit.cta_text')}
          <strong className="text-white block sm:inline sm:ml-1 text-lg">{t('customer_benefit.cta_highlight')}</strong>
        </p>
      </div>

    </div>
  );
};

export default CustomerBenefitCard;
