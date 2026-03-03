import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronDown, ZoomIn, ZoomOut, Trash2, Plus, X, Filter, Euro } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface NodeData {
    id: string;
    label: string;
    role: string;
    level: number;
    contracts?: number;   // estimated contracts per month
    children?: NodeData[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { color: string; dot: string; earn: number }> = {
    'Family Pro': { color: 'bg-blue-500 text-white', dot: 'bg-blue-500', earn: 65 },
    Family: { color: 'bg-green-500 text-white', dot: 'bg-green-500', earn: 40 },
    'Family Utility': { color: 'bg-teal-500 text-white', dot: 'bg-teal-500', earn: 35 },
    Member: { color: 'bg-gray-400 text-white', dot: 'bg-gray-400', earn: 20 },
    Potential: { color: 'bg-dashed border-2 border-gray-300 text-gray-300', dot: 'bg-gray-300', earn: 0 },
};

const AVAILABLE_ROLES = ['Member', 'Family', 'Family Utility', 'Family Pro'];

const INITIAL_TREE_DATA: NodeData = {
    id: 'me',
    label: 'Tu',
    role: 'Family Pro',
    level: -1,  // root is special, not a real network level
    contracts: 3,
    children: [
        {
            id: 'marco',
            label: 'Marco G.',
            role: 'Family',
            level: 0,
            contracts: 2,
            children: [
                {
                    id: 'anna',
                    label: 'Anna L.',
                    role: 'Member',
                    level: 1,
                    contracts: 1,
                    children: [
                        { id: 'filippo', label: 'Filippo', role: 'Member', level: 2, contracts: 1 },
                        { id: 'elisa', label: 'Elisa', role: 'Member', level: 2, contracts: 0 },
                    ]
                },
                { id: 'luca', label: 'Luca B.', role: 'Member', level: 1, contracts: 1 },
            ]
        },
        {
            id: 'elena',
            label: 'Elena R.',
            role: 'Family',
            level: 0,
            contracts: 2,
            children: [
                {
                    id: 'sara',
                    label: 'Sara M.',
                    role: 'Member',
                    level: 1,
                    contracts: 1,
                    children: [
                        { id: 'matteo', label: 'Matteo', role: 'Member', level: 2, contracts: 1 },
                    ]
                },
            ]
        },
        {
            id: 'pietro',
            label: 'Pietro V.',
            role: 'Family Pro',
            level: 0,
            contracts: 3,
            children: [
                { id: 'giulia', label: 'Giulia S.', role: 'Member', level: 1, contracts: 1 },
                {
                    id: 'davide',
                    label: 'Davide N.',
                    role: 'Member',
                    level: 1,
                    contracts: 1,
                    children: [
                        { id: 'chiara', label: 'Chiara', role: 'Member', level: 2, contracts: 0 },
                        { id: 'fabio', label: 'Fabio', role: 'Member', level: 2, contracts: 1 },
                    ]
                },
            ]
        }
    ]
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const countNodes = (node: NodeData): number =>
    1 + (node.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0);

const calcEarnings = (node: NodeData): number => {
    const cfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Member'];
    const own = (node.contracts ?? 0) * cfg.earn;
    const sub = node.children?.reduce((s, c) => s + calcEarnings(c), 0) ?? 0;
    return own + sub;
};

let _uidCounter = 1000;
const uid = () => `node-${++_uidCounter}`;

// ─── Add Member Modal ─────────────────────────────────────────────────────────

const AddMemberModal = ({ parentLabel, onAdd, onClose }: { parentLabel: string; onAdd: (label: string, role: string, contracts: number) => void; onClose: () => void; }) => {
    const [label, setLabel] = useState('');
    const [role, setRole] = useState('Member');
    const [contracts, setContracts] = useState(1);

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                className="relative bg-white rounded-[2rem] p-7 w-full max-w-sm shadow-2xl z-10"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700">
                    <X size={18} />
                </button>
                <h3 className="text-xl font-black text-slate-900 mb-1">Aggiungi Membro</h3>
                <p className="text-xs text-gray-400 mb-6">Sotto: <span className="font-bold text-gray-600">{parentLabel}</span></p>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">Nome</label>
                        <input
                            autoFocus value={label} onChange={e => setLabel(e.target.value)}
                            placeholder="Es: Mario R."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">Qualifica</label>
                        <select value={role} onChange={e => setRole(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
                            {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">Contratti / mese stimati</label>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setContracts(c => Math.max(0, c - 1))}
                                className="w-10 h-10 rounded-full bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition-colors">−</button>
                            <span className="flex-1 text-center text-2xl font-black text-green-600">{contracts}</span>
                            <button onClick={() => setContracts(c => Math.min(20, c + 1))}
                                className="w-10 h-10 rounded-full bg-green-100 font-bold text-green-700 hover:bg-green-200 transition-colors">+</button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { if (label.trim()) onAdd(label.trim(), role, contracts); }}
                    disabled={!label.trim()}
                    className="mt-7 w-full py-3.5 bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-green-700 active:scale-95"
                >
                    Aggiungi alla Rete
                </button>
            </motion.div>
        </div>
    );
};

// ─── Member Detail Modal ──────────────────────────────────────────────────────

const MemberDetailModal = ({ node, onClose, onDelete }: { node: NodeData; onClose: () => void; onDelete: (id: string) => void; }) => {
    const cfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Member'];
    const networkSize = countNodes(node) - 1;
    const networkEarnings = calcEarnings(node);

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
                className="relative bg-white rounded-[2rem] p-7 w-full max-w-sm shadow-2xl z-10"
            >
                <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700"><X size={18} /></button>

                {/* Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260 }}
                        className="w-20 h-20 rounded-[1.5rem] bg-green-100 flex items-center justify-center mb-3 shadow-inner"
                    >
                        <User size={38} className="text-green-600" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-slate-900">{node.label}</h3>
                    <span className={`mt-2 text-xs font-black px-3 py-1 rounded-full ${cfg.color}`}>{node.role}</span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                        { label: 'Livello Rete', value: node.level },
                        { label: 'Contratti/mese', value: node.contracts ?? 0 },
                        { label: 'Team sotto', value: networkSize },
                        { label: 'Guadagno stimato', value: `€${networkEarnings}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                            <p className="text-xl font-black text-green-700">{value}</p>
                        </div>
                    ))}
                </div>

                {node.id !== 'me' && (
                    <button
                        onClick={() => { onDelete(node.id); onClose(); }}
                        className="w-full mt-2 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
                    >
                        Rimuovi dalla Rete
                    </button>
                )}
            </motion.div>
        </div>
    );
};

// ─── Tree Node ───────────────────────────────────────────────────────────────

const TreeNodeComponent = ({
    node, onUpdate, onAdd, onDelete, theme, isProjection, filterRole
}: {
    node: NodeData;
    onUpdate: (id: string, newLabel: string) => void;
    onAdd: (parentId: string, label: string, role: string, contracts: number) => void;
    onDelete: (id: string) => void;
    theme: string;
    isProjection?: boolean;
    filterRole: string;
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const hasChildren = node.children && node.children.length > 0;
    const isMain = node.id === 'me';         // only the root 'Tu' node
    const isLevel3 = node.level >= 2;        // level 2+ = compact style
    const isGhost = node.id.includes('ghost');
    const isHidden = filterRole !== 'all' && node.role !== filterRole && !isMain;

    const cfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Member'];

    // Animate in with staggered delay based on level
    const animDelay = node.level * 0.08;

    const nodeStyles = {
        glass: isMain
            ? 'bg-gradient-to-br from-green-500 to-green-700 text-white shadow-[0_10px_30px_rgba(34,197,94,0.35)] border-white/20'
            : isLevel3
                ? 'bg-white/80 text-slate-800 border-white/60 shadow-sm backdrop-blur-md'
                : 'bg-white/95 text-slate-900 border-white/60 shadow-[0_8px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl',
        dark: isMain
            ? 'bg-gradient-to-br from-yellow-600 to-amber-700 text-white border-yellow-400/30'
            : isLevel3
                ? 'bg-zinc-900/80 text-zinc-100 border-white/5 backdrop-blur-md'
                : 'bg-zinc-900/90 text-white border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl',
        minimal: isMain ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200 shadow-sm'
    };

    const connectorColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';

    if (isHidden && !isMain) return null;

    return (
        <div className="flex flex-col items-center relative">
            {/* ── Node Card ── */}
            <motion.div
                layout
                initial={{ scale: 0.7, opacity: 0, y: -10 }}
                animate={{ scale: isGhost ? 0.9 : 1, opacity: isGhost ? 0.45 : 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22, delay: animDelay }}
                onClick={() => !isGhost && !isProjection && setShowDetail(true)}
                className={[
                    'relative rounded-[1.5rem] border z-20 transition-all duration-300 cursor-pointer',
                    nodeStyles[theme as keyof typeof nodeStyles],
                    isMain ? 'p-5 min-w-[150px]' : isLevel3 ? 'p-2 min-w-[80px]' : node.level === 0 ? 'p-3 min-w-[110px]' : 'p-3 min-w-[120px]',
                    isProjection && !isMain ? 'opacity-50 grayscale scale-95 border-dashed' : '',
                    'flex flex-col items-center group hover:scale-105 hover:shadow-xl',
                ].join(' ')}
            >
                {/* User icon */}
                <div className={[
                    'p-2.5 rounded-full mb-2 shadow-inner transition-transform group-hover:scale-110',
                    isMain ? 'bg-white/20 text-white' : theme === 'dark' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-600',
                    isLevel3 ? 'scale-75 mb-0' : '',
                ].join(' ')}>
                    {isMain ? <User size={22} /> : <Users size={isLevel3 ? 14 : 20} />}
                </div>

                {/* Name + role badge */}
                <span className={`font-black ${isLevel3 ? 'text-[11px]' : 'text-sm'} tracking-tight leading-tight mb-0.5 text-center`}>
                    {node.label}
                </span>

                {/* Colored qualification badge */}
                {!isLevel3 && !isMain && (
                    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded-full mt-1 ${cfg.color}`}>
                        {node.role}
                    </span>
                )}
                {isMain && (
                    <span className="text-[10px] uppercase font-bold opacity-70 tracking-widest mt-0.5">{node.role}</span>
                )}

                {/* Earnings per node (small badge) */}
                {!isGhost && !isMain && !isLevel3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: animDelay + 0.2 }}
                        className="flex items-center gap-0.5 mt-1.5 bg-green-50 text-green-700 rounded-full px-2 py-0.5 text-[9px] font-black"
                    >
                        <Euro size={9} />
                        {calcEarnings(node)}/m
                    </motion.div>
                )}

                {/* Expand/collapse toggle */}
                {hasChildren && (
                    <div
                        onClick={e => { e.stopPropagation(); setIsExpanded(v => !v); }}
                        className={`absolute -bottom-3 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm border border-white/50 backdrop-blur-sm z-30 ${isExpanded ? 'bg-white text-slate-800 rotate-180' : 'bg-slate-800 text-white'}`}
                    >
                        <ChevronDown size={12} strokeWidth={3} />
                    </div>
                )}

                {/* + Add member button (on hover, non-ghost) */}
                {!isGhost && !isProjection && !isLevel3 && (
                    <button
                        onClick={e => { e.stopPropagation(); setShowAddModal(true); }}
                        className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-green-600 hover:scale-110 z-30"
                        title="Aggiungi membro"
                    >
                        <Plus size={14} strokeWidth={3} />
                    </button>
                )}
            </motion.div>

            {/* ── Children ── */}
            <AnimatePresence mode="wait">
                {hasChildren && isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.95 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className={`flex gap-6 sm:gap-16 relative justify-center px-4 ${isLevel3 ? 'mt-8' : 'mt-16'}`}
                    >
                        <svg className={`absolute left-0 w-full pointer-events-none overflow-visible z-10 no-export ${isLevel3 ? 'top-[-32px] h-8' : 'top-[-64px] h-16'}`}>
                            {node.children!.map((_, idx) => {
                                const total = node.children!.length;
                                const step = 100 / total;
                                const targetX = idx * step + step / 2;
                                const h = isLevel3 ? 32 : 64;
                                return (
                                    <path
                                        key={idx}
                                        d={`M 50% 0 C 50% ${h / 2}, ${targetX}% ${h / 2}, ${targetX}% ${h}`}
                                        stroke={connectorColor}
                                        strokeWidth="1.5"
                                        fill="none"
                                        strokeLinecap="round"
                                        className="opacity-60"
                                    />
                                );
                            })}
                        </svg>
                        {node.children!.map(child => (
                            <TreeNodeComponent
                                key={child.id}
                                node={child}
                                onUpdate={onUpdate}
                                onAdd={onAdd}
                                onDelete={onDelete}
                                theme={theme}
                                isProjection={child.id.includes('ghost')}
                                filterRole={filterRole}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Modals ── */}
            <AnimatePresence>
                {showAddModal && (
                    <AddMemberModal
                        parentLabel={node.label}
                        onClose={() => setShowAddModal(false)}
                        onAdd={(label, role, contracts) => {
                            onAdd(node.id, label, role, contracts);
                            setShowAddModal(false);
                            setIsExpanded(true);
                        }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showDetail && !isGhost && (
                    <MemberDetailModal
                        node={node}
                        onClose={() => setShowDetail(false)}
                        onDelete={id => { onDelete(id); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Main CommunityTree ───────────────────────────────────────────────────────

interface TreeProps {
    theme?: 'glass' | 'dark' | 'minimal';
    isProjectionMode?: boolean;
}

const CommunityTree = ({ theme = 'glass', isProjectionMode = false }: TreeProps) => {
    const [treeData, setTreeData] = useState<NodeData>(INITIAL_TREE_DATA);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [manualZoom, setManualZoom] = useState(false);
    const [filterRole, setFilterRole] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    // Stats
    const totalMembers = countNodes(treeData) - 1; // exclude "me"
    const totalEarnings = calcEarnings(treeData);

    // Projection mode: inject ghost nodes
    const displayData = React.useMemo(() => {
        if (!isProjectionMode) return treeData;
        const injectGhosts = (node: NodeData): NodeData => {
            const children = node.children ? node.children.map(injectGhosts) : [];
            if (node.level < 3) {
                const targetCount = node.level === 0 ? 4 : 2;
                for (let i = children.length; i < targetCount; i++) {
                    children.push({ id: `ghost-${node.id}-${i}`, label: 'Nuovo Partner', role: 'Potential', level: node.level + 1 });
                }
            }
            return { ...node, children };
        };
        return injectGhosts(treeData);
    }, [treeData, isProjectionMode]);

    // Auto-resize
    const handleAutoResize = useCallback(() => {
        if (containerRef.current && !manualZoom) {
            const vw = window.innerWidth - 64;
            const cw = containerRef.current.scrollWidth;
            setScale(cw > vw ? Math.max(0.3, vw / cw) : 1);
        }
    }, [manualZoom]);

    useEffect(() => {
        handleAutoResize();
        window.addEventListener('resize', handleAutoResize);
        return () => window.removeEventListener('resize', handleAutoResize);
    }, [displayData, handleAutoResize]);

    // CRUD helpers
    const updateNodeLabel = (id: string, newLabel: string) => {
        const rec = (n: NodeData): NodeData =>
            n.id === id ? { ...n, label: newLabel } : { ...n, children: n.children?.map(rec) };
        setTreeData(rec);
    };

    const addMember = (parentId: string, label: string, role: string, contracts: number) => {
        const newNode: NodeData = { id: uid(), label, role, level: 0, contracts, children: [] };
        const rec = (n: NodeData): NodeData => {
            if (n.id === parentId) {
                // 'me' is level -1, so its direct children are level 0
                const level = Math.max(0, n.level + 1);
                return { ...n, children: [...(n.children ?? []), { ...newNode, level }] };
            }
            return { ...n, children: n.children?.map(rec) };
        };
        setTreeData(rec);
    };

    const deleteMember = (id: string) => {
        const rec = (n: NodeData): NodeData => ({
            ...n,
            children: n.children?.filter(c => c.id !== id).map(rec)
        });
        setTreeData(rec);
    };

    const handleZoomIn = () => { setManualZoom(true); setScale(p => Math.min(p + 0.1, 2)); };
    const handleZoomOut = () => { setManualZoom(true); setScale(p => Math.max(p - 0.1, 0.2)); };
    const handleResetZoom = () => { setManualZoom(false); setTimeout(handleAutoResize, 10); };

    return (
        <div
            className={`pt-0 pb-16 overflow-hidden no-scrollbar rounded-[2rem] min-h-[600px] transition-colors duration-500 relative ${theme === 'dark' ? 'bg-zinc-950/20' : 'bg-transparent'}`}
            id="export-card-tree"
        >
            {/* ── Stats Header Bar ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mx-6 mb-6 gap-3 flex-wrap"
            >
                {/* Total members counter */}
                <motion.div
                    key={totalMembers}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 shadow-sm"
                >
                    <Users size={16} className="text-green-600" />
                    <div>
                        <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none">Membri Totali</p>
                        <p className="text-2xl font-black text-green-700 leading-none mt-0.5">{totalMembers}</p>
                    </div>
                </motion.div>

                {/* Estimated network earnings */}
                <motion.div
                    key={totalEarnings}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl px-5 py-3 shadow-sm"
                >
                    <Euro size={16} className="text-emerald-600" />
                    <div>
                        <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none">Guadagno Stimato</p>
                        <p className="text-2xl font-black text-emerald-700 leading-none mt-0.5">€{totalEarnings}</p>
                    </div>
                </motion.div>

                {/* Filter dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowFilterMenu(v => !v)}
                        className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm text-xs font-black text-gray-600 hover:bg-white transition-all"
                    >
                        <Filter size={14} className="text-green-600" />
                        {filterRole === 'all' ? 'Tutti' : filterRole}
                    </button>
                    <AnimatePresence>
                        {showFilterMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[160px]"
                            >
                                {['all', ...AVAILABLE_ROLES].map(r => {
                                    const cfg = r === 'all' ? null : ROLE_CONFIG[r];
                                    return (
                                        <button
                                            key={r}
                                            onClick={() => { setFilterRole(r); setShowFilterMenu(false); }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-left hover:bg-gray-50 transition-colors ${filterRole === r ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                                        >
                                            {cfg && <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />}
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
            <div className="flex flex-wrap gap-2 justify-center mb-4 px-6 no-export">
                {Object.entries(ROLE_CONFIG).filter(([k]) => k !== 'Potential').map(([role, cfg]) => (
                    <span key={role} className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${cfg.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                        {role} · €{cfg.earn}/contratto
                    </span>
                ))}
            </div>

            {/* ── Zoom Controls ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 dark:border-white/10 z-50 no-export transition-all hover:scale-105">
                <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"><ZoomOut size={18} /></button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1" />
                <button onClick={handleResetZoom} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors font-bold text-xs">{Math.round(scale * 100)}%</button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1" />
                <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"><ZoomIn size={18} /></button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-2" />
                <button
                    onClick={() => { if (confirm('Resetta l\'albero? Rimarrai solo tu!')) setTreeData({ id: 'me', label: 'Tu', role: 'Family Pro', level: 0, contracts: 3, children: [] }); }}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                    title="Resetta Albero"
                ><Trash2 size={16} /></button>
            </div>

            {/* ── Tree ── */}
            <div
                className="transition-transform duration-500 origin-top flex justify-center pt-0 pb-20"
                style={{ transform: `scale(${scale})` }}
            >
                <div ref={containerRef} className="px-10 pb-20">
                    <TreeNodeComponent
                        node={displayData}
                        onUpdate={updateNodeLabel}
                        onAdd={addMember}
                        onDelete={deleteMember}
                        theme={theme}
                        filterRole={filterRole}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommunityTree;
