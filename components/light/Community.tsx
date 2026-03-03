import React, { useState } from 'react';
import { Users, Lock, Unlock, ChevronRight, Info, Share2, List, Network, Settings, Palette, Eye, EyeOff, Save, Instagram, Send, Phone, User, CheckCircle2, X } from 'lucide-react';


import { UNLOCK_CONDITIONS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import CommunityTree from './CommunityTree';
import { exportAsImage } from './utils/exportUtils';
import { useProfileStore } from './store/useProfileStore';
import BrandingOverlay from './BrandingOverlay';
import { useLanguage } from '../../contexts/LanguageContext';

import { useShary } from '../../contexts/SharyContext';

interface CommunityProps {
    personalUnits: number;
}

const Community: React.FC<CommunityProps> = ({ personalUnits }) => {
    const { t } = useLanguage();
    const { isActive: isSharyActive } = useShary(); // USIAMO SHARY HOOK
    const [theme, setTheme] = useState<'glass' | 'dark' | 'minimal'>('glass');
    const [isProjection, setIsProjection] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSharyTipOpen, setIsSharyTipOpen] = useState(false); // NEW STATE
    const profile = useProfileStore();



    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        setTimeout(async () => {
            await exportAsImage('export-card-tree', `Union-Compass-Network-${theme}`);
            setIsExporting(false);
        }, 300);
    };

    return (
        <div className="space-y-8 text-slate-800 dark:text-white pb-24 sm:pb-0">
            {/* Header Community Premium */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-[3rem] border border-white/50 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-[1.2rem] bg-gradient-to-br from-union-green-400 to-union-green-600 text-white flex items-center justify-center shadow-lg shadow-union-green-500/30">
                            <Users size={26} />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">{t('comm_sync.title')}</h2>
                            <p className="text-xs font-bold text-slate-500 dark:text-gray-400 mt-1 uppercase tracking-widest opacity-80">{t('comm_sync.subtitle')}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {isSharyActive && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsSharyTipOpen(true)}
                                className="flex items-center gap-2 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-5 py-2.5 rounded-full border border-cyan-500/20 shadow-sm transition-all text-xs font-black uppercase tracking-wider backdrop-blur-sm"
                            >
                                <span className="text-lg">🤖</span>
                                <span>{t('comm_sync.tip_btn')}</span>
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Secondary Controls (Barra strumenti per Albero) - Floating iOS Island Style */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-8 p-2 pr-2 bg-white/40 dark:bg-white/5 rounded-full border border-white/40 dark:border-white/5 shadow-sm backdrop-blur-md"
                >
                    <div className="flex items-center gap-1 pl-2">
                        <div className="flex bg-gray-100/80 dark:bg-black/20 p-1 rounded-full border border-white/20 shadow-inner">
                            <button onClick={() => setTheme('glass')} className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-300 ${theme === 'glass' ? 'bg-white text-union-green-600 shadow-sm scale-110' : 'text-gray-400 hover:text-gray-600'}`} title="Glass Mode">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300"></div>
                            </button>
                            <button onClick={() => setTheme('dark')} className={`h-8 w-8 flex items-center justify-center rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-slate-800 text-yellow-500 shadow-sm scale-110' : 'text-gray-400 hover:text-gray-600'}`} title="Dark Mode">
                                <div className="w-3 h-3 rounded-full bg-slate-900 border border-yellow-500/50"></div>
                            </button>
                        </div>

                        <div className="w-px h-6 bg-gray-300/50 mx-2"></div>

                        <button
                            onClick={() => setIsProjection(!isProjection)}
                            className={`px-5 py-2 rounded-full transition-all font-bold text-xs uppercase tracking-wide flex items-center gap-2 ${isProjection ? 'bg-union-green-500 text-white shadow-md' : 'bg-transparent text-slate-500 hover:bg-white/40'}`}
                        >
                            {isProjection ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span>{isProjection ? 'Reale' : 'Proiezione'}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 bg-white/60 dark:bg-white/5 text-slate-500 dark:text-gray-300 rounded-full hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                        >
                            <Settings size={18} />
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={isExporting}
                            className={`px-6 py-2.5 rounded-full transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${isExporting ? 'bg-gray-100 text-gray-400' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}
                        >
                            <Share2 size={14} className={isExporting ? 'animate-pulse' : ''} />
                            <span>{isExporting ? '...' : 'Esporta'}</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key="tree"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    id="export-card-tree"
                    className={`p-1 pt-4 rounded-[2.5rem] relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white/40 text-slate-800'}`}
                >
                    {theme === 'dark' && <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>}

                    <div className="flex justify-between items-start mb-6 px-6 no-export relative z-10">
                        <div>
                            <h3 className={`text-xl font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{t('comm_sync.visualizer_pro')}</h3>
                            <p className="text-xs font-bold opacity-50 mt-1 tracking-wide">{t('comm_sync.visualizer_desc')}</p>
                        </div>
                        <div className="text-right">
                            <motion.p
                                key={isProjection ? 'proj' : 'real'}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-5xl font-black tracking-tighter ${theme === 'dark' ? 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-amber-600' : 'text-transparent bg-clip-text bg-gradient-to-br from-union-green-600 to-emerald-800'}`}
                            >
                                {isProjection ? '20+' : '12'}
                            </motion.p>
                            <p className="text-[9px] opacity-40 uppercase font-black tracking-widest mt-1">{t('comm_sync.total_members')}</p>
                        </div>
                    </div>

                    <div className="relative z-0">
                        <CommunityTree theme={theme} isProjectionMode={isProjection} />
                    </div>

                    <BrandingOverlay />
                </motion.div>
            </AnimatePresence>

            {/* Shary Tip Modal Premium */}
            <AnimatePresence>
                {isSharyTipOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSharyTipOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 rounded-[3rem] p-8 w-full max-w-md shadow-2xl overflow-hidden border border-cyan-500/20"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-blue-500" />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-3xl bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-4xl shadow-inner border border-cyan-200/50">🤖</div>
                                <div>
                                    <h3 className="font-black text-2xl text-slate-900 dark:text-white leading-tight tracking-tighter">{t('comm_sync.tip_title')}</h3>
                                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-black uppercase tracking-widest mt-1 opacity-70">{t('comm_sync.tip_subtitle')}</p>
                                </div>
                                <button onClick={() => setIsSharyTipOpen(false)} className="ml-auto p-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="space-y-6 text-slate-600 dark:text-gray-400 text-xs font-bold leading-relaxed mb-8">
                                <div className="p-4 bg-cyan-50/50 dark:bg-cyan-500/5 rounded-2xl border border-cyan-100 dark:border-cyan-500/10">
                                    <strong className="text-cyan-700 dark:text-cyan-400 block mb-2 text-sm uppercase tracking-tight">{t('comm_sync.tip_1_title')}</strong>
                                    <p className="opacity-80">{t('comm_sync.tip_1_desc')}</p>
                                </div>

                                <div className="p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200/50 dark:border-white/5 space-y-4">
                                    <strong className="text-slate-800 dark:text-white block text-sm uppercase tracking-tight">{t('comm_sync.tip_2_title')}</strong>
                                    <div className="space-y-3">
                                        {[
                                            { l: '0', u: '1' },
                                            { l: '1', u: '3' },
                                            { l: '2', u: '5' },
                                            { l: '3', u: '7' },
                                            { l: '4-5', u: '10' }
                                        ].map(item => (
                                            <div key={item.l} className="flex justify-between items-center bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl shadow-sm">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVELLO {item.l}</span>
                                                <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">{item.u} Utenze</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] italic opacity-60 mt-4 leading-normal" dangerouslySetInnerHTML={{ __html: t('comm_sync.tip_2_desc') }} />
                                </div>

                                <div className="p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                                    <strong className="text-blue-700 dark:text-blue-400 block mb-2 text-sm uppercase tracking-tight">{t('comm_sync.tip_3_title')}</strong>
                                    <p className="opacity-80">{t('comm_sync.tip_3_desc')}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsSharyTipOpen(false)}
                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
                            >
                                {t('comm_sync.understand_btn')}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {
                isSettingsOpen && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsSettingsOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            className="relative bg-white dark:bg-slate-900 rounded-[3rem] p-8 w-full max-w-md shadow-2xl overflow-hidden border border-union-green-500/20"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-union-green-500 to-cyan-600" />
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">{t('comm_sync.customize_brand')}</h2>
                                    <p className="text-xs opacity-60 font-bold italic text-slate-500 dark:text-gray-400 mt-1">{t('comm_sync.customize_desc')}</p>
                                </div>
                                <button onClick={() => setIsSettingsOpen(false)} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                        <User size={14} /> {t('comm_sync.full_name')}
                                    </label>
                                    <input
                                        value={profile.name} onChange={(e) => profile.setProfile({ name: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                        placeholder="Esempio: Marco Rossi"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                            <Instagram size={14} /> Instagram
                                        </label>
                                        <input
                                            value={profile.instagram} onChange={(e) => profile.setProfile({ instagram: e.target.value })}
                                            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                            placeholder="username"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                            <Send size={14} /> Telegram
                                        </label>
                                        <input
                                            value={profile.telegram} onChange={(e) => profile.setProfile({ telegram: e.target.value })}
                                            className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                            placeholder="username"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-union-green-600 flex items-center gap-2 tracking-widest">
                                        <Phone size={14} /> {t('comm_sync.phone')}
                                    </label>
                                    <input
                                        value={profile.phone} onChange={(e) => profile.setProfile({ phone: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white"
                                        placeholder="+39 333..."
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="w-full mt-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 hover:bg-union-green-600 dark:hover:bg-union-green-500 dark:hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                <Save size={20} /> {t('comm_sync.save_close')}
                            </button>
                        </motion.div>
                    </div>
                )
            }

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-indigo-500/5 dark:bg-indigo-500/10 p-6 rounded-[2.5rem] border border-indigo-500/20 shadow-lg relative overflow-hidden group"
            >
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-inner">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-indigo-800 dark:text-indigo-400 uppercase tracking-widest mb-1">{t('comm_sync.unlock_rule_title')}</p>
                        <p className="text-[10px] text-indigo-700/80 dark:text-indigo-400/70 leading-relaxed font-bold">
                            {t('comm_sync.unlock_rule_desc', { n: UNLOCK_CONDITIONS.LEVEL_5 })}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div >
    );
};

export default Community;
