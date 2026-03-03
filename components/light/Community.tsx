import React, { useState } from 'react';
import { Users, Share2, Settings, X, User, Instagram, Send, Phone, Save, Info } from 'lucide-react';
import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
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

// ─── Shared tree node type (mirrored from CommunityTree) ─────────────────────

interface NodeData {
    id: string;
    label: string;
    role: string;
    level: number;          // -1 = root "Tu", 0 = first line, 1, 2...
    contracts?: number;
    children?: NodeData[];
}

// The same initial data as CommunityTree so the table is always consistent
const INITIAL_TREE: NodeData = {
    id: 'me', label: 'Tu', role: 'Family Pro', level: -1, contracts: 3,
    children: [
        {
            id: 'marco', label: 'Marco G.', role: 'Family', level: 0, contracts: 2,
            children: [
                {
                    id: 'anna', label: 'Anna L.', role: 'Member', level: 1, contracts: 1,
                    children: [
                        { id: 'filippo', label: 'Filippo', role: 'Member', level: 2, contracts: 1 },
                        { id: 'elisa', label: 'Elisa', role: 'Member', level: 2, contracts: 0 },
                    ]
                },
                { id: 'luca', label: 'Luca B.', role: 'Member', level: 1, contracts: 1 },
            ]
        },
        {
            id: 'elena', label: 'Elena R.', role: 'Family', level: 0, contracts: 2,
            children: [
                {
                    id: 'sara', label: 'Sara M.', role: 'Member', level: 1, contracts: 1,
                    children: [
                        { id: 'matteo', label: 'Matteo', role: 'Member', level: 2, contracts: 1 },
                    ]
                },
            ]
        },
        {
            id: 'pietro', label: 'Pietro V.', role: 'Family Pro', level: 0, contracts: 3,
            children: [
                { id: 'giulia', label: 'Giulia S.', role: 'Member', level: 1, contracts: 1 },
                {
                    id: 'davide', label: 'Davide N.', role: 'Member', level: 1, contracts: 1,
                    children: [
                        { id: 'chiara', label: 'Chiara', role: 'Member', level: 2, contracts: 0 },
                        { id: 'fabio', label: 'Fabio', role: 'Member', level: 2, contracts: 1 },
                    ]
                },
            ]
        }
    ]
};

// Flatten tree by level (level -1 = "Tu" root, mapped to simulator level 0)
function flattenByLevel(node: NodeData, acc: Map<number, NodeData[]> = new Map()): Map<number, NodeData[]> {
    // map node.level -1 → simulator level 0 (Tu), node.level 0 → sim level 1, etc.
    const simLevel = node.level + 1;  // -1→0, 0→1, 1→2, 2→3
    if (!acc.has(simLevel)) acc.set(simLevel, []);
    acc.get(simLevel)!.push(node);
    node.children?.forEach(c => flattenByLevel(c, acc));
    return acc;
}

const fmt = (n: number) => n.toFixed(2).replace('.', ',') + ' €';
const fmtInt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const Community: React.FC<CommunityProps> = ({ personalUnits }) => {
    const { t } = useLanguage();
    const { isActive: isSharyActive } = useShary();
    const [theme, setTheme] = useState<'glass' | 'dark'>('glass');
    const [isProjection, setIsProjection] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [utilityType, setUtilityType] = useState<'DOMESTIC' | 'BUSINESS'>('DOMESTIC');
    const [monthRange, setMonthRange] = useState<'1' | '13' | '25'>('1');
    const profile = useProfileStore();

    const handleExport = async () => {
        setIsExporting(true);
        setTimeout(async () => {
            await exportAsImage('export-card-tree', `Union-Compass-Network-${theme}`);
            setIsExporting(false);
        }, 300);
    };

    // ── Earnings table from tree ──────────────────────────────────────────────
    const byLevel = flattenByLevel(INITIAL_TREE);
    const maxSimLevel = Math.max(...Array.from(byLevel.keys()));

    const commissions = utilityType === 'DOMESTIC'
        ? (monthRange === '1' ? LEVEL_COMMISSIONS.DOMESTIC.RECURRING
            : monthRange === '13' ? LEVEL_COMMISSIONS.DOMESTIC.RECURRING_13_24
                : LEVEL_COMMISSIONS.DOMESTIC.RECURRING_25_PLUS)
        : (monthRange === '1' ? LEVEL_COMMISSIONS.BUSINESS.RECURRING
            : monthRange === '13' ? LEVEL_COMMISSIONS.BUSINESS.RECURRING_13_24
                : LEVEL_COMMISSIONS.BUSINESS.RECURRING_25_PLUS);

    const oneTum = utilityType === 'DOMESTIC'
        ? LEVEL_COMMISSIONS.DOMESTIC.ONE_TUM
        : LEVEL_COMMISSIONS.BUSINESS.ONE_TUM;

    const unlockFor = (simLevel: number) => {
        if (simLevel <= 1) return 0;
        if (simLevel === 2) return UNLOCK_CONDITIONS.LEVEL_1;
        if (simLevel === 3) return UNLOCK_CONDITIONS.LEVEL_2;
        if (simLevel === 4) return UNLOCK_CONDITIONS.LEVEL_3;
        if (simLevel === 5) return UNLOCK_CONDITIONS.LEVEL_4;
        return UNLOCK_CONDITIONS.LEVEL_5;
    };

    const tableRows = Array.from({ length: Math.max(6, maxSimLevel + 1) }, (_, si) => {
        const nodes = byLevel.get(si) ?? [];
        const userCount = nodes.reduce((s, n) => s + (n.contracts ?? 0), 0); // total contracts at this level
        const memberCount = nodes.length;
        const needed = unlockFor(si);
        const isUnlocked = personalUnits >= needed || si <= 1;
        const commRate = commissions[si] ?? commissions[commissions.length - 1] ?? 1;
        const oneT = oneTum[si] ?? oneTum[oneTum.length - 1] ?? 0;
        const gettone = isUnlocked ? userCount * oneT : 0;
        const ricorrenza = isUnlocked ? userCount * commRate : 0;
        return { si, memberCount, userCount, gettone, ricorrenza, isUnlocked, needed };
    });

    const totals = tableRows.reduce((acc, r) => ({
        members: acc.members + r.memberCount,
        contracts: acc.contracts + r.userCount,
        gettone: acc.gettone + r.gettone,
        ricorrenza: acc.ricorrenza + r.ricorrenza,
    }), { members: 0, contracts: 0, gettone: 0, ricorrenza: 0 });

    return (
        <div className="space-y-6 text-slate-800 dark:text-white pb-24 sm:pb-0">

            {/* ── Header ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-lg">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-green-400 to-green-600 text-white flex items-center justify-center shadow-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t('comm_sync.title')}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('comm_sync.subtitle')}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Utility type */}
                        <div className="flex bg-gray-100/80 dark:bg-black/20 p-1 rounded-full text-xs font-black">
                            {(['DOMESTIC', 'BUSINESS'] as const).map(u => (
                                <button key={u} onClick={() => setUtilityType(u)}
                                    className={`px-3 py-1.5 rounded-full transition-all ${utilityType === u ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                                    {u === 'DOMESTIC' ? '🏠 Dom.' : '🏢 Bus.'}
                                </button>
                            ))}
                        </div>

                        {/* Settings */}
                        <button onClick={() => setIsSettingsOpen(true)}
                            className="p-2.5 bg-white/60 dark:bg-white/5 text-slate-500 rounded-full hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                            <Settings size={16} />
                        </button>

                        {/* Export */}
                        <button onClick={handleExport} disabled={isExporting}
                            className={`px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all ${isExporting ? 'bg-gray-100 text-gray-400' : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}>
                            <Share2 size={12} className={isExporting ? 'animate-pulse' : ''} />
                            <span>{isExporting ? '...' : 'Esporta'}</span>
                        </button>
                    </div>
                </div>

                {/* Month range selector */}
                <div className="grid grid-cols-3 bg-gray-100/60 dark:bg-black/20 p-1 rounded-2xl gap-1">
                    {([['1', 'Mesi 1-12'], ['13', 'Mesi 13-24'], ['25', 'Mesi 25+']] as const).map(([v, label]) => (
                        <button key={v} onClick={() => setMonthRange(v)}
                            className={`py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${monthRange === v ? 'bg-white dark:bg-slate-800 text-green-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
                            {label}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* ── Earnings Table ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 dark:border-white/10 shadow-lg overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-5 gap-2 px-6 py-4 bg-slate-50/80 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    <div>Livello</div>
                    <div className="text-center">Membri</div>
                    <div className="text-center">Contratti</div>
                    <div className="text-center">Gettone Una Tantum</div>
                    <div className="text-center">Ricorrenza/mese</div>
                </div>

                {/* Rows */}
                {tableRows.map(({ si, memberCount, userCount, gettone, ricorrenza, isUnlocked, needed }) => (
                    <motion.div key={si} layout
                        className={`grid grid-cols-5 gap-2 px-6 py-4 border-b border-gray-50 dark:border-white/5 transition-opacity ${isUnlocked ? 'opacity-100' : 'opacity-40'}`}>
                        {/* Level label */}
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${si === 0 ? 'bg-yellow-100 text-yellow-700' : si === 1 ? 'bg-orange-100 text-orange-600' : si === 2 ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'}`}>
                                {si === 0 ? '👑 Tu' : `L${si - 1}`}
                            </span>
                            {!isUnlocked && (
                                <span className="text-[8px] text-red-400 font-bold">🔒 {needed}u</span>
                            )}
                        </div>
                        {/* Members */}
                        <div className="flex items-center justify-center">
                            <span className="text-base font-black text-slate-700 dark:text-white">{memberCount}</span>
                        </div>
                        {/* Contracts */}
                        <div className="flex items-center justify-center">
                            <span className="text-base font-black text-slate-500 dark:text-white/60">{userCount}</span>
                        </div>
                        {/* Gettone */}
                        <div className="flex items-center justify-center">
                            <span className={`text-sm font-black ${isUnlocked && gettone > 0 ? 'text-amber-600' : 'text-gray-300'}`}>
                                {isUnlocked ? fmt(gettone) : '–'}
                            </span>
                        </div>
                        {/* Ricorrenza */}
                        <div className="flex items-center justify-center">
                            <span className={`text-sm font-black ${isUnlocked && ricorrenza > 0 ? 'text-green-600' : 'text-gray-300'}`}>
                                {isUnlocked ? fmt(ricorrenza) : '–'}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {/* Totals row */}
                <div className="grid grid-cols-5 gap-2 px-6 py-5 bg-slate-50/80 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest">
                    <div className="text-slate-400">Totali</div>
                    <div className="text-center text-slate-700 dark:text-white text-base">{totals.members}</div>
                    <div className="text-center text-slate-500 dark:text-white/60 text-base">{totals.contracts}</div>
                    <div className="text-center text-amber-600 text-lg">{fmt(totals.gettone)}</div>
                    <div className="text-center text-green-600 text-lg">{fmt(totals.ricorrenza)}</div>
                </div>
            </motion.div>

            {/* ── Visual Tree (collapsible) ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <div id="export-card-tree"
                    className={`p-1 pt-4 rounded-[2.5rem] relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-white/40 text-slate-800'}`}>
                    {theme === 'dark' && <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-purple-500/5 pointer-events-none" />}

                    <div className="flex justify-between items-center mb-4 px-6 no-export">
                        <h3 className={`text-sm font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                            {t('comm_sync.visualizer_pro')}
                        </h3>
                        <div className="flex items-center gap-2">
                            {/* Theme toggle */}
                            <div className="flex bg-gray-100/80 dark:bg-black/20 p-0.5 rounded-full">
                                <button onClick={() => setTheme('glass')} className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${theme === 'glass' ? 'bg-white shadow-sm' : 'text-gray-400'}`}>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300" />
                                </button>
                                <button onClick={() => setTheme('dark')} className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-sm' : 'text-gray-400'}`}>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-yellow-500/50" />
                                </button>
                            </div>
                            {/* Projection toggle */}
                            <button onClick={() => setIsProjection(v => !v)}
                                className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isProjection ? 'bg-green-500 text-white' : 'bg-transparent text-slate-400 hover:bg-white/40'}`}>
                                {isProjection ? 'Reale' : 'Proiezione'}
                            </button>
                        </div>
                    </div>

                    <div className="relative z-0">
                        <CommunityTree theme={theme} isProjectionMode={isProjection} />
                    </div>
                    <BrandingOverlay />
                </div>
            </motion.div>

            {/* ── Info card ── */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-indigo-500/5 p-5 rounded-[2rem] border border-indigo-500/20 shadow-sm">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center shrink-0">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-1">{t('comm_sync.unlock_rule_title')}</p>
                        <p className="text-[10px] text-indigo-600/70 leading-relaxed font-bold">
                            {t('comm_sync.unlock_rule_desc', { n: UNLOCK_CONDITIONS.LEVEL_5 })}
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* ── Settings Modal ── */}
            {isSettingsOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSettingsOpen(false)}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
                    <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative bg-white dark:bg-slate-900 rounded-[3rem] p-8 w-full max-w-md shadow-2xl border border-green-500/20">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-cyan-600 rounded-t-[3rem]" />
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{t('comm_sync.customize_brand')}</h2>
                                <p className="text-xs opacity-60 font-bold text-slate-500 dark:text-gray-400 mt-1">{t('comm_sync.customize_desc')}</p>
                            </div>
                            <button onClick={() => setIsSettingsOpen(false)} className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-slate-900 dark:hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-green-600 flex items-center gap-2 tracking-widest"><User size={14} /> {t('comm_sync.full_name')}</label>
                                <input value={profile.name} onChange={e => profile.setProfile({ name: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-green-500 transition-all text-slate-800 dark:text-white"
                                    placeholder="Esempio: Marco Rossi" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-green-600 flex items-center gap-2 tracking-widest"><Instagram size={14} /> Instagram</label>
                                    <input value={profile.instagram} onChange={e => profile.setProfile({ instagram: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:border-green-500 transition-all text-slate-800 dark:text-white"
                                        placeholder="username" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-green-600 flex items-center gap-2 tracking-widest"><Send size={14} /> Telegram</label>
                                    <input value={profile.telegram} onChange={e => profile.setProfile({ telegram: e.target.value })}
                                        className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-4 py-4 text-sm font-bold outline-none focus:border-green-500 transition-all text-slate-800 dark:text-white"
                                        placeholder="username" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-green-600 flex items-center gap-2 tracking-widest"><Phone size={14} /> {t('comm_sync.phone')}</label>
                                <input value={profile.phone} onChange={e => profile.setProfile({ phone: e.target.value })}
                                    className="w-full bg-gray-100 dark:bg-white/5 border border-transparent rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-green-500 transition-all text-slate-800 dark:text-white"
                                    placeholder="+39 333..." />
                            </div>
                        </div>
                        <button onClick={() => setIsSettingsOpen(false)}
                            className="w-full mt-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl py-4 font-black flex items-center justify-center gap-3 hover:bg-green-600 dark:hover:bg-green-500 dark:hover:text-white transition-all shadow-xl">
                            <Save size={20} /> {t('comm_sync.save_close')}
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Community;
