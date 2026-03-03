import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Filter, Euro, ChevronDown, Trash2, ZoomIn, ZoomOut } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NodeData {
    id: string;
    label: string;
    role: string;
    level: number;
    contracts?: number;
    children?: NodeData[];
}

// ─── Role Config ──────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, {
    glow: string;        // shadow glow color
    ring: string;        // border ring color
    bg: string;          // node background
    badge: string;       // badge pill bg+text
    earn: number;
}> = {
    'Family Pro': {
        glow: 'shadow-[0_0_24px_rgba(251,191,36,0.7)]',
        ring: 'border-yellow-400',
        bg: 'bg-gradient-to-br from-orange-500 to-amber-600',
        badge: 'bg-yellow-400 text-yellow-900',
        earn: 65,
    },
    'Family': {
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.65)]',
        ring: 'border-orange-400',
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        badge: 'bg-orange-400 text-white',
        earn: 40,
    },
    'Family Utility': {
        glow: 'shadow-[0_0_18px_rgba(52,211,153,0.6)]',
        ring: 'border-emerald-400',
        bg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
        badge: 'bg-emerald-400 text-white',
        earn: 35,
    },
    'Member': {
        glow: 'shadow-[0_0_14px_rgba(167,139,250,0.55)]',
        ring: 'border-violet-400',
        bg: 'bg-gradient-to-br from-violet-500 to-purple-700',
        badge: 'bg-violet-400 text-white',
        earn: 20,
    },
    'Potential': {
        glow: '',
        ring: 'border-white/10',
        bg: 'bg-white/5',
        badge: 'bg-white/10 text-white/30',
        earn: 0,
    },
};

const AVAILABLE_ROLES = ['Member', 'Family', 'Family Utility', 'Family Pro'];

// Level color for the L-badge
const LEVEL_BADGE: Record<number, string> = {
    [-1]: 'bg-yellow-400 text-black',     // root "Tu"
    0: 'bg-orange-500 text-white',
    1: 'bg-violet-500 text-white',
    2: 'bg-purple-700 text-white',
    3: 'bg-indigo-700 text-white',
    4: 'bg-blue-800 text-white',
};
const levelBadge = (level: number) => LEVEL_BADGE[level] ?? 'bg-gray-800 text-white';

// ─── Node sizes ────────────────────────────────────────────────────────────────
//  root → 80px circle
//  L0   → 56px
//  L1   → 48px
//  L2+  → 38px

const nodeSize = (level: number, isRoot: boolean) =>
    isRoot ? 80 : level === 0 ? 56 : level === 1 ? 48 : 38;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const countNodes = (n: NodeData): number =>
    1 + (n.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0);

const calcEarnings = (n: NodeData): number => {
    const cfg = ROLE_CONFIG[n.role] ?? ROLE_CONFIG['Member'];
    return (n.contracts ?? 0) * cfg.earn +
        (n.children?.reduce((s, c) => s + calcEarnings(c), 0) ?? 0);
};

let _uid = 2000;
const uid = () => `n-${++_uid}`;

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

// ─── Add Member Modal ─────────────────────────────────────────────────────────

const AddMemberModal = ({ parentLabel, onAdd, onClose }: {
    parentLabel: string;
    onAdd: (label: string, role: string, contracts: number) => void;
    onClose: () => void;
}) => {
    const [label, setLabel] = useState('');
    const [role, setRole] = useState('Member');
    const [contracts, setContracts] = useState(1);

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                className="relative bg-zinc-900 border border-white/10 rounded-[2rem] p-7 w-full max-w-sm shadow-2xl z-10"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white/50 hover:text-white">
                    <X size={18} />
                </button>
                <h3 className="text-xl font-black text-white mb-1">Aggiungi Membro</h3>
                <p className="text-xs text-white/40 mb-6">Sotto: <span className="text-white/70 font-bold">{parentLabel}</span></p>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">Nome</label>
                        <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
                            placeholder="Es: Mario R."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-white/20" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">Qualifica</label>
                        <select value={role} onChange={e => setRole(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer">
                            {AVAILABLE_ROLES.map(r => <option key={r} value={r} className="bg-zinc-900">{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1 block">Contratti / mese</label>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setContracts(c => Math.max(0, c - 1))}
                                className="w-10 h-10 rounded-full bg-white/10 font-bold text-white hover:bg-white/20 transition-colors">−</button>
                            <span className="flex-1 text-center text-2xl font-black text-emerald-400">{contracts}</span>
                            <button onClick={() => setContracts(c => Math.min(20, c + 1))}
                                className="w-10 h-10 rounded-full bg-emerald-500/20 font-bold text-emerald-400 hover:bg-emerald-500/40 transition-colors">+</button>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => { if (label.trim()) onAdd(label.trim(), role, contracts); }}
                    disabled={!label.trim()}
                    className="mt-7 w-full py-3.5 bg-emerald-600 disabled:bg-white/10 disabled:text-white/20 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-emerald-500 active:scale-95"
                >
                    Aggiungi alla Rete
                </button>
            </motion.div>
        </div>
    );
};

// ─── Member Detail Modal ──────────────────────────────────────────────────────

const MemberDetailModal = ({ node, onClose, onDelete }: {
    node: NodeData; onClose: () => void; onDelete: (id: string) => void;
}) => {
    const cfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Member'];
    const networkSize = countNodes(node) - 1;
    const networkEarnings = calcEarnings(node);

    return (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                className="relative bg-zinc-900 border border-white/10 rounded-[2rem] p-7 w-full max-w-sm shadow-2xl z-10"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white/50 hover:text-white"><X size={18} /></button>
                <div className="flex flex-col items-center mb-6">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260 }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 border-2 ${cfg.ring} ${cfg.bg} ${cfg.glow}`}>
                        <span className="text-2xl font-black text-white">{node.label.charAt(0)}</span>
                    </motion.div>
                    <h3 className="text-2xl font-black text-white">{node.label}</h3>
                    <span className={`mt-2 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${cfg.badge}`}>{node.role}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                        { label: 'Livello', value: node.level === -1 ? 'Root' : `L${node.level}` },
                        { label: 'Contratti/mese', value: node.contracts ?? 0 },
                        { label: 'Team sotto', value: networkSize },
                        { label: 'Guadagno stimato', value: `€${networkEarnings}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">{label}</p>
                            <p className="text-xl font-black text-emerald-400">{value}</p>
                        </div>
                    ))}
                </div>
                {node.id !== 'me' && (
                    <button onClick={() => { onDelete(node.id); onClose(); }}
                        className="w-full mt-2 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold text-sm hover:bg-red-500/20 transition-colors">
                        Rimuovi dalla Rete
                    </button>
                )}
            </motion.div>
        </div>
    );
};

// ─── Single Tree Node (circular glow style) ────────────────────────────────────

const TreeNode = ({
    node, onAdd, onDelete, isProjection, filterRole
}: {
    node: NodeData;
    onAdd: (parentId: string, label: string, role: string, contracts: number) => void;
    onDelete: (id: string) => void;
    isProjection?: boolean;
    filterRole: string;
}) => {
    const [expanded, setExpanded] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const isRoot = node.id === 'me';
    const isGhost = node.id.includes('ghost');
    const cfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Member'];
    const size = nodeSize(node.level, isRoot);
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isCompact = node.level >= 2;

    const isHidden = filterRole !== 'all' && node.role !== filterRole && !isRoot;
    if (isHidden) return null;

    const animDelay = Math.max(0, node.level) * 0.06;

    const connectorColor = 'rgba(255,255,255,0.08)';

    const levelStr = node.level === -1 ? 'Tu' : `L${node.level}`;

    return (
        <div className="flex flex-col items-center relative select-none">
            {/* Node */}
            <div className="relative group">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: isGhost ? 0.7 : 1, opacity: isGhost ? 0.3 : 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22, delay: animDelay }}
                    onClick={() => !isGhost && setShowDetail(true)}
                    style={{ width: size, height: size }}
                    className={[
                        'rounded-full border-2 flex items-center justify-center cursor-pointer',
                        'transition-all duration-300 relative',
                        cfg.bg, cfg.ring, !isGhost ? cfg.glow : '',
                        'hover:scale-110 hover:brightness-110',
                    ].join(' ')}
                >
                    {/* Crown for root */}
                    {isRoot && <span className="text-2xl">👑</span>}
                    {/* Initial for others */}
                    {!isRoot && (
                        <span className={`font-black text-white ${isCompact ? 'text-xs' : 'text-sm'}`}>
                            {node.label.charAt(0)}
                        </span>
                    )}

                    {/* Level badge top-right */}
                    <span className={`absolute -top-1.5 -right-1.5 text-[8px] font-black px-1.5 py-0.5 rounded-full ${levelBadge(node.level)} shadow-lg`}>
                        {levelStr}
                    </span>
                </motion.div>

                {/* + Add button (hover) */}
                {!isGhost && !isProjection && !isCompact && (
                    <button
                        onClick={e => { e.stopPropagation(); setShowAdd(true); }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-125 z-30 text-[10px] font-black"
                    >+</button>
                )}
            </div>

            {/* Label + earnings under node */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isGhost ? 0.3 : 1 }}
                transition={{ delay: animDelay + 0.1 }}
                className="flex flex-col items-center mt-2 gap-0.5"
                style={{ maxWidth: size + 20 }}
            >
                <span className={`font-black text-white text-center leading-tight truncate w-full ${isCompact ? 'text-[9px]' : 'text-[11px]'}`}>
                    {node.label}
                </span>
                {!isCompact && !isGhost && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${cfg.badge}`}>{node.role}</span>
                )}
                {!isGhost && (
                    <span className="text-[8px] text-emerald-400 font-bold flex items-center gap-0.5">
                        <Euro size={7} />
                        {calcEarnings(node)}/m
                    </span>
                )}
            </motion.div>

            {/* Expand toggle */}
            {hasChildren && (
                <button
                    onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
                    className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${expanded ? 'bg-white/10 rotate-180' : 'bg-white/5'} text-white/50 hover:text-white`}
                >
                    <ChevronDown size={10} strokeWidth={3} />
                </button>
            )}

            {/* Children */}
            <AnimatePresence mode="wait">
                {hasChildren && expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="flex gap-4 sm:gap-10 relative justify-center px-2 mt-8"
                    >
                        {/* SVG connectors */}
                        <svg className="absolute left-0 w-full pointer-events-none overflow-visible z-10 top-[-32px] h-8">
                            {node.children!.map((_, idx) => {
                                const total = node.children!.length;
                                const step = 100 / total;
                                const tx = idx * step + step / 2;
                                return (
                                    <path key={idx}
                                        d={`M 50% 0 C 50% 16, ${tx}% 16, ${tx}% 32`}
                                        stroke={connectorColor} strokeWidth="1" fill="none" strokeLinecap="round" />
                                );
                            })}
                        </svg>

                        {node.children!.map(child => (
                            <TreeNode key={child.id} node={child} onAdd={onAdd} onDelete={onDelete}
                                isProjection={child.id.includes('ghost')} filterRole={filterRole} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <AnimatePresence>
                {showAdd && (
                    <AddMemberModal parentLabel={node.label} onClose={() => setShowAdd(false)}
                        onAdd={(label, role, contracts) => { onAdd(node.id, label, role, contracts); setShowAdd(false); setExpanded(true); }} />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showDetail && (
                    <MemberDetailModal node={node} onClose={() => setShowDetail(false)} onDelete={onDelete} />
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main CommunityTree ────────────────────────────────────────────────────────

interface TreeProps {
    theme?: 'glass' | 'dark' | 'minimal';
    isProjectionMode?: boolean;
}

const CommunityTree = ({ isProjectionMode = false }: TreeProps) => {
    const [treeData, setTreeData] = useState<NodeData>(INITIAL_TREE);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [manualZoom, setManualZoom] = useState(false);
    const [filterRole, setFilterRole] = useState('all');
    const [showFilter, setShowFilter] = useState(false);

    const totalMembers = countNodes(treeData) - 1;
    const totalEarnings = calcEarnings(treeData);

    // Projection ghosts
    const displayData = React.useMemo(() => {
        if (!isProjectionMode) return treeData;
        const inject = (n: NodeData): NodeData => {
            const children = n.children ? n.children.map(inject) : [];
            if (n.level < 2) {
                const target = n.level === -1 ? 4 : 2;
                for (let i = children.length; i < target; i++)
                    children.push({ id: `ghost-${n.id}-${i}`, label: 'Nuovo', role: 'Potential', level: n.level + 1 });
            }
            return { ...n, children };
        };
        return inject(treeData);
    }, [treeData, isProjectionMode]);

    const autoResize = useCallback(() => {
        if (containerRef.current && !manualZoom) {
            const vw = window.innerWidth - 80;
            const cw = containerRef.current.scrollWidth;
            setScale(cw > vw ? Math.max(0.25, vw / cw) : 1);
        }
    }, [manualZoom]);

    useEffect(() => {
        autoResize();
        window.addEventListener('resize', autoResize);
        return () => window.removeEventListener('resize', autoResize);
    }, [displayData, autoResize]);

    const addMember = (parentId: string, label: string, role: string, contracts: number) => {
        const newNode: NodeData = { id: uid(), label, role, level: 0, contracts, children: [] };
        const rec = (n: NodeData): NodeData => {
            if (n.id === parentId) {
                const level = Math.max(0, n.level + 1);
                return { ...n, children: [...(n.children ?? []), { ...newNode, level }] };
            }
            return { ...n, children: n.children?.map(rec) };
        };
        setTreeData(rec);
    };

    const deleteMember = (id: string) => {
        const rec = (n: NodeData): NodeData => ({
            ...n, children: n.children?.filter(c => c.id !== id).map(rec)
        });
        setTreeData(rec);
    };

    return (
        <div className="relative rounded-[2rem] overflow-hidden bg-zinc-950 min-h-[600px] pb-20 pt-4" id="export-card-tree">

            {/* Animated background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 left-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-20 right-1/4 w-56 h-56 bg-violet-500/5 rounded-full blur-[80px]" />
            </div>

            {/* ── Stats header ── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mx-6 mb-6 gap-3 flex-wrap relative z-10">

                {/* Members */}
                <motion.div key={totalMembers} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    className="flex items-center gap-3 bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-5 py-3">
                    <div>
                        <p className="text-[8px] uppercase font-black text-white/30 tracking-widest leading-none">Membri Totali</p>
                        <p className="text-2xl font-black text-orange-400 leading-none mt-0.5">{totalMembers}</p>
                    </div>
                </motion.div>

                {/* Earnings */}
                <motion.div key={totalEarnings} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-5 py-3">
                    <Euro size={14} className="text-emerald-400" />
                    <div>
                        <p className="text-[8px] uppercase font-black text-white/30 tracking-widest leading-none">Guadagno Stimato</p>
                        <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5">€{totalEarnings}</p>
                    </div>
                </motion.div>

                {/* Filter */}
                <div className="relative">
                    <button onClick={() => setShowFilter(v => !v)}
                        className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-black text-white/60 hover:bg-white/10 transition-all">
                        <Filter size={13} className="text-emerald-400" />
                        {filterRole === 'all' ? 'Tutti' : filterRole}
                    </button>
                    <AnimatePresence>
                        {showFilter && (
                            <motion.div initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[180px]">
                                {['all', ...AVAILABLE_ROLES].map(r => {
                                    const c = r === 'all' ? null : ROLE_CONFIG[r];
                                    return (
                                        <button key={r} onClick={() => { setFilterRole(r); setShowFilter(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-left hover:bg-white/5 transition-colors ${filterRole === r ? 'text-emerald-400' : 'text-white/60'}`}>
                                            {c && <span className={`w-2 h-2 rounded-full ${c.badge.split(' ')[0]}`} />}
                                            {r === 'all' ? '🌐 Tutti i Ruoli' : r}
                                        </button>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* ── Legend ── */}
            <div className="flex flex-wrap gap-2 justify-center mb-6 px-4 relative z-10">
                {Object.entries(ROLE_CONFIG).filter(([k]) => k !== 'Potential').map(([role, c]) => (
                    <span key={role} className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${c.badge}`}>
                        {role} · €{c.earn}/ctr
                    </span>
                ))}
            </div>

            {/* ── Tree ── */}
            <div className="transition-transform duration-500 origin-top flex justify-center pb-20 relative z-10"
                style={{ transform: `scale(${scale})` }}>
                <div ref={containerRef} className="px-10">
                    <TreeNode node={displayData} onAdd={addMember} onDelete={deleteMember} filterRole={filterRole} />
                </div>
            </div>

            {/* ── Zoom controls ── */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full shadow-xl z-50">
                <button onClick={() => { setManualZoom(true); setScale(p => Math.max(p - 0.1, 0.2)); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ZoomOut size={16} /></button>
                <button onClick={() => { setManualZoom(false); setTimeout(autoResize, 10); }}
                    className="w-9 h-9 text-[10px] font-bold text-white/50 hover:text-white transition-colors">{Math.round(scale * 100)}%</button>
                <button onClick={() => { setManualZoom(true); setScale(p => Math.min(p + 0.1, 2)); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"><ZoomIn size={16} /></button>
                <div className="w-px h-4 bg-white/10 mx-1" />
                <button onClick={() => { if (confirm('Reset albero?')) setTreeData({ id: 'me', label: 'Tu', role: 'Family Pro', level: -1, contracts: 3, children: [] }); }}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/30 transition-colors">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default CommunityTree;
