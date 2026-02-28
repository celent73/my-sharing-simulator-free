
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MonthlyGrowthData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Dream {
  id: string;
  title: string;
  cost: number;
  icon: string;
  gradient: string;
}

const PRESET_STYLES = [
  { icon: '💎', gradient: 'from-pink-500 to-purple-600' },
  { icon: '🚀', gradient: 'from-blue-600 to-indigo-900' },
  { icon: '🏰', gradient: 'from-amber-200 to-yellow-500' },
  { icon: '🛥️', gradient: 'from-cyan-500 to-blue-700' },
  { icon: '🎁', gradient: 'from-red-500 to-pink-600' },
  { icon: '🌍', gradient: 'from-emerald-400 to-cyan-600' },
  { icon: '🏍️', gradient: 'from-orange-500 to-red-600' },
  { icon: '🎓', gradient: 'from-indigo-400 to-cyan-400' },
];

interface DreamVisualizerProps {
  monthlyData: MonthlyGrowthData[];
}

const DreamVisualizer: React.FC<DreamVisualizerProps> = ({ monthlyData }) => {
  const { t, language } = useLanguage();

  const defaultDreams = useMemo<Dream[]>(() => [
    { id: 'iphone', title: t('dreams.presets.iphone'), cost: 1500, icon: '📱', gradient: 'from-slate-700 to-slate-900' },
    { id: 'maldive', title: t('dreams.presets.maldive'), cost: 4000, icon: '🏖️', gradient: 'from-cyan-400 to-blue-600' },
    { id: 'rolex', title: t('dreams.presets.rolex'), cost: 12000, icon: '⌚', gradient: 'from-yellow-500 to-amber-700' },
    { id: 'car', title: t('dreams.presets.car'), cost: 35000, icon: '🚗', gradient: 'from-red-500 to-red-700' },
    { id: 'house', title: t('dreams.presets.house'), cost: 60000, icon: '🏠', gradient: 'from-emerald-500 to-emerald-700' },
    { id: 'freedom', title: t('dreams.presets.freedom'), cost: 100000, icon: '🦅', gradient: 'from-violet-600 to-purple-800' },
  ], [t]);

  const [customDreams, setCustomDreams] = useState<Dream[]>([]);
  const allDreams = useMemo(() => [...defaultDreams, ...customDreams], [defaultDreams, customDreams]);

  const [selectedDreamId, setSelectedDreamId] = useState<string>('maldive');

  // Update selected dream object when ID changes or allDreams upgrades
  const selectedDream = useMemo(() =>
    allDreams.find(d => d.id === selectedDreamId) || allDreams[0]
    , [allDreams, selectedDreamId]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDreamTitle, setNewDreamTitle] = useState('');
  const [newDreamCost, setNewDreamCost] = useState('');

  const prediction = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return null;

    // Safety checks
    const currentTotal = monthlyData[monthlyData.length - 1]?.cumulativeEarnings || 0;
    const cost = selectedDream?.cost || 1; // Prevent division by zero check

    // Find the first month where cumulative earnings exceed the cost
    const reachedMonth = monthlyData.find(m => m.cumulativeEarnings >= cost);

    // Calculate progress (capped at 100%)
    const progress = Math.min(100, Math.max(0, (currentTotal / cost) * 100));

    if (reachedMonth) {
      const today = new Date();
      // Add the month index to current date to estimate the future date
      const targetDate = new Date(today.getFullYear(), today.getMonth() + reachedMonth.month, 1);
      // Format: "Febbraio 2026"
      const dateString = targetDate.toLocaleString(language === 'it' ? 'it-IT' : 'de-DE', { month: 'long', year: 'numeric' });
      // Capitalize first letter
      const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

      return {
        month: reachedMonth.month,
        dateString: formattedDate,
        reached: true,
        progress: 100
      };
    } else {
      return {
        month: null,
        dateString: language === 'it' ? "Oltre il periodo simulato" : "Außerhalb des Zeitraums",
        reached: false,
        progress
      };
    }
  }, [monthlyData, selectedDream, language]);


  const handleAddDream = () => {
    if (!newDreamTitle || !newDreamCost) return;

    const cost = parseFloat(newDreamCost);
    if (isNaN(cost) || cost <= 0) return;

    // Pick random style
    const style = PRESET_STYLES[Math.floor(Math.random() * PRESET_STYLES.length)];

    const newDream: Dream = {
      id: Date.now().toString(),
      title: newDreamTitle,
      cost: cost,
      icon: style.icon,
      gradient: style.gradient
    };

    setCustomDreams([...customDreams, newDream]);
    setSelectedDreamId(newDream.id); // Select it immediately
    setIsModalOpen(false);
    setNewDreamTitle('');
    setNewDreamCost('');
  };



  return (
    <>
      <div className="bg-black/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 p-8 overflow-hidden relative group/container hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500">

        {/* Ambient Light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        {/* Header with + Button */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-lg text-3xl text-white backdrop-blur-md">
              🌠
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">{t('dreams.title')}</h2>
              <p className="text-sm font-medium text-slate-400">{t('dreams.subtitle')}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
          >
            <span className="text-lg leading-none text-emerald-400">+</span> <span className="hidden sm:inline">{t('dreams.add_btn')}</span>
          </button>
        </div>

        {/* Dream Selector */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-2 relative z-10 touch-pan-x custom-scrollbar snap-x">
          {allDreams.map(dream => (
            <button
              key={dream.id}
              onClick={() => setSelectedDreamId(dream.id)}
              className={`
                  snap-start flex flex-col items-center justify-center p-4 rounded-[2rem] min-w-[120px] min-h-[160px] border transition-all duration-300 outline-none relative overflow-hidden group
                  ${selectedDream.id === dream.id
                  ? `bg-white/10 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105 z-10`
                  : 'bg-white/5 border-transparent hover:bg-white/10 hover:scale-105 opacity-60 hover:opacity-100'}
               `}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${dream.gradient} opacity-20`} />
              <span className="text-4xl mb-3 filter drop-shadow-lg relative z-10 transform group-hover:scale-110 transition-transform duration-300">{dream.icon}</span>
              <span className={`text-xs font-black whitespace-nowrap mb-1 relative z-10 text-white tracking-tight`}>
                {dream.title}
              </span>
              <span className={`text-[10px] font-bold relative z-10 text-slate-400 group-hover:text-white transition-colors`}>
                €{new Intl.NumberFormat('it-IT', { notation: "compact" }).format(dream.cost)}
              </span>

              {selectedDream.id === dream.id && (
                <div className="absolute bottom-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
              )}
            </button>
          ))}
        </div>

        {/* Result Main Card - Standard View */}
        <div className={`
              relative rounded-[2.5rem] p-8 sm:p-12 text-white overflow-hidden shadow-2xl transition-all duration-700 group
              min-h-[350px] flex flex-col justify-between border border-white/10
              bg-gradient-to-br ${selectedDream.gradient}
         `}>
          {/* Background Overlay */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

          {/* Real Image Background (Simulated AI) */}
          {selectedDream.id === 'maldive' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473116763249-56381a3ec4a1?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-opacity duration-1000 group-hover:scale-105 transform"></div>}
          {selectedDream.id === 'iphone' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592750475338-74b7b2191b79?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-opacity duration-1000 group-hover:scale-105 transform"></div>}
          {selectedDream.id === 'rolex' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-opacity duration-1000 group-hover:scale-105 transform"></div>}
          {selectedDream.id === 'car' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-opacity duration-1000 group-hover:scale-105 transform"></div>}
          {selectedDream.id === 'house' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-opacity duration-1000 group-hover:scale-105 transform"></div>}
          {selectedDream.id === 'freedom' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-50 transition-opacity duration-1000 group-hover:scale-105 transform"></div>}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-widest shadow-sm mb-4">
                  <span className="animate-pulse text-emerald-400">●</span> AI Vision
                </div>
                <h3 className="text-4xl sm:text-6xl font-black drop-shadow-2xl tracking-tighter mb-2">
                  {selectedDream.title}
                </h3>
                <p className="text-white/80 font-bold text-xl drop-shadow-lg flex items-baseline gap-2">
                  Valore: <span className="text-3xl text-white tracking-tight">€{selectedDream.cost.toLocaleString('it-IT')}</span>
                </p>
              </div>

            </div>

            <div className="mt-8">
              {prediction?.reached ? (
                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex items-center justify-between gap-6">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{t('dreams.will_be_yours')}</p>
                    <div className="text-3xl sm:text-4xl font-black tracking-tighter text-white drop-shadow-lg">
                      {prediction.dateString}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">Tra</div>
                    <div className="text-2xl font-black text-white">{t('dreams.in_months').replace('months', `${prediction.month}`)}</div>
                  </div>
                </div>
              ) : (
                <div className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
                  <p className="text-white font-bold text-lg mb-1">{t('dreams.wip')}</p>
                  <p className="text-sm text-slate-400">{t('dreams.wip_desc')}</p>
                </div>
              )}

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/80 mb-2">
                  <span>Prossimità Obiettivo</span>
                  <span>{prediction?.progress.toFixed(0)}%</span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden backdrop-blur-md shadow-inner border border-white/5">
                  <div
                    className={`h-full ${prediction?.reached ? 'bg-emerald-500' : 'bg-white'} shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-1000 ease-out relative`}
                    style={{ width: `${prediction?.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>



      {/* Add Dream Modal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#1c1c1e] text-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white/10 animate-in zoom-in-95 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 transition-colors bg-white/5 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {t('dreams.modal_title')}
              </h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('dreams.input_name')}</label>
                <input
                  type="text"
                  placeholder="Es. Ristrutturazione Bagno"
                  value={newDreamTitle}
                  onChange={(e) => setNewDreamTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 outline-none transition-all text-white font-bold placeholder:text-slate-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{t('dreams.input_cost')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <span className="text-slate-400 font-bold">€</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Es. 15000"
                    value={newDreamCost}
                    onChange={(e) => setNewDreamCost(e.target.value)}
                    className="w-full px-5 py-4 pl-8 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 outline-none transition-all text-white font-bold placeholder:text-slate-600"
                  />
                </div>
                {/* FLUID SLIDER */}
                <div className="mt-6 px-1">
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="500"
                    value={Number(newDreamCost) > 150000 ? 150000 : (Number(newDreamCost) || 0)}
                    onChange={(e) => setNewDreamCost(e.target.value)}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                  />
                  <div className="flex justify-between text-[9px] uppercase tracking-wider text-slate-500 mt-2 font-black">
                    <span>0 €</span>
                    <span>75k €</span>
                    <span>150k+ €</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddDream}
                disabled={!newDreamTitle || !newDreamCost}
                className="w-full mt-4 bg-white text-black hover:bg-slate-200 font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 uppercase tracking-widest text-xs"
              >
                {t('dreams.confirm_btn')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DreamVisualizer;
