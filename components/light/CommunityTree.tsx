import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronDown, ZoomIn, ZoomOut, Trash2, Plus, X, Filter, Euro, Zap } from 'lucide-react';

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


const ROLE_CONFIG: Record<string, { color: string; dot: string; earn: number; indirectEarn: number }> = {
    'Family Pro': { color: 'bg-[#bc1275] text-white', dot: 'bg-[#bc1275]', earn: 65, indirectEarn: 25 },
    Family: { color: 'bg-green-500 text-white', dot: 'bg-green-500', earn: 40, indirectEarn: 20 },
    'Family Utility': { color: 'bg-teal-500 text-white', dot: 'bg-teal-500', earn: 50, indirectEarn: 15 },
    Member: { color: 'bg-gray-400 text-white', dot: 'bg-gray-400', earn: 15, indirectEarn: 0 },
    Potential: { color: 'bg-dashed border-2 border-gray-300 text-gray-300', dot: 'bg-gray-300', earn: 0, indirectEarn: 0 },
};

const AVAILABLE_ROLES = ['Member', 'Family', 'Family Utility', 'Family Pro'];


const INITIAL_TREE_DATA: NodeData = {
    id: 'me',
    label: 'Tu',
    role: 'Family Utility',
    level: -1,
    contracts: 3, // Still has 3 personal units for qualification but we'll count earnings differently
    children: [
        {
            id: 'direct-1',
            label: 'Partner 1',
            role: 'Family Utility',
            level: 0,
            contracts: 1,
            children: [
                { id: 'sub-1-1', label: 'Collaboratore 1.1', role: 'Member', level: 1, contracts: 1 },
                { id: 'sub-1-2', label: 'Collaboratore 1.2', role: 'Member', level: 1, contracts: 1 },
                { id: 'sub-1-3', label: 'Collaboratore 1.3', role: 'Member', level: 1, contracts: 1 },
            ]
        },
        {
            id: 'direct-2',
            label: 'Partner 2',
            role: 'Family Utility',
            level: 0,
            contracts: 1,
            children: [
                { id: 'sub-2-1', label: 'Collaboratore 2.1', role: 'Member', level: 1, contracts: 1 },
                { id: 'sub-2-2', label: 'Collaboratore 2.2', role: 'Member', level: 1, contracts: 1 },
                { id: 'sub-2-3', label: 'Collaboratore 2.3', role: 'Member', level: 1, contracts: 1 },
            ]
        },
        {
            id: 'direct-3',
            label: 'Partner 3',
            role: 'Family Utility',
            level: 0,
            contracts: 1,
            children: [
                { id: 'sub-3-1', label: 'Collaboratore 3.1', role: 'Member', level: 1, contracts: 1 },
                { id: 'sub-3-2', label: 'Collaboratore 3.2', role: 'Member', level: 1, contracts: 1 },
                { id: 'sub-3-3', label: 'Collaboratore 3.3', role: 'Member', level: 1, contracts: 1 },
            ]
        }
    ]
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const countNodes = (node: NodeData): number =>
    1 + (node.children?.reduce((s, c) => s + countNodes(c), 0) ?? 0);

const calcEarnings = (node: NodeData): number => {
    const cfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Member'];
    return (node.contracts ?? 0) * cfg.earn;
};

const calcTutorialEarnings = (node: NodeData, expandedIds: string[]): number => {
    let total = 0;
    const isExpanded = expandedIds.includes(node.id);
    
    if (isExpanded && node.children) {
        node.children.forEach(child => {
            const roleCfg = ROLE_CONFIG[node.role] ?? ROLE_CONFIG['Family Utility'];
            // Directs earn €50, Indirects earn €15
            const earnPerContract = child.level === 0 ? 50 : 15;
            total += (child.contracts ?? 1) * earnPerContract;
            
            // Recurse if child is also expanded
            total += calcTutorialEarnings(child, expandedIds);
        });
    }
    return total;
};

const calcMonthly = (node: NodeData, expandedIds: string[]): number => {
    let total = 0;
    const isExpanded = expandedIds.includes(node.id);
    if (isExpanded && node.children) {
        node.children.forEach(child => {
            total += (child.contracts ?? 1) * 1;
            total += calcMonthly(child, expandedIds);
        });
    }
    return total;
};

const check3x3BonusVisible = (node: NodeData, expandedIds: string[]): boolean => {
    if (node.id !== 'me' || !expandedIds.includes('me')) return false;
    const directs = node.children ?? [];
    if (directs.length < 3) return false;
    // Bonus appears only when all 3 directs are expanded (revealing all 9 indirects)
    return directs.every(d => expandedIds.includes(d.id));
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
                        { label: 'Indiretti (Mensile)', value: `€${calcMonthly(node, [])}` }, // Assuming calcMonthly needs expandedIds, but for a single node detail, it's not clear how it should behave. Passing empty for now.
                        { label: 'Bonus Una Tantum', value: `€${calcEarnings(node)}` },
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

const TreeNodeComponent = ({ node, theme, onAdd, onDelete, onUpdate, isProjection, expandedIds, toggleExpand }: {
    node: NodeData; theme: string; onAdd: (parentId: string, label: string, role: string, contracts: number) => void;
    onDelete: (id: string) => void; onUpdate: (id: string, newLabel: string) => void; isProjection?: boolean;
    expandedIds: string[]; toggleExpand: (id: string) => void;
}) => {
    const isExpanded = expandedIds.includes(node.id);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const hasChildren = node.children && node.children.length > 0;
    const isMain = node.id === 'me';         // only the root 'Tu' node
    const isLevel3 = node.level >= 2;        // level 2+ = compact style
    const isGhost = node.id.includes('ghost');
    const isHidden = false; // filterRole is removed from here

    const is3x3Complete = isMain && check3x3BonusVisible(node, expandedIds);
    const renderedRole = is3x3Complete ? 'Family Pro' : node.role;
    const cfg = ROLE_CONFIG[renderedRole] ?? ROLE_CONFIG['Member'];

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

    // Card background color based on role for "Tu" or standard
    const roleColorClass = isMain ? (ROLE_CONFIG[renderedRole]?.color || 'bg-green-600') : '';

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
                    isMain ? (roleColorClass + ' shadow-xl border-white/20') : nodeStyles[theme as keyof typeof nodeStyles],
                    isMain ? 'p-3 sm:p-5 min-w-[130px] sm:min-w-[150px]' : isLevel3 ? 'p-1.5 min-w-[70px]' : node.level === 0 ? 'p-1.5 sm:p-3 min-w-[90px] sm:min-w-[110px]' : 'p-1.5 sm:p-3 min-w-[90px] sm:min-w-[120px]',
                    isProjection && !isMain ? 'opacity-50 grayscale scale-95 border-dashed' : '',
                    'flex flex-col items-center group hover:scale-105 hover:shadow-xl',
                ].join(' ')}
            >
                {/* 3x3 Bonus Badge for 'Tu' */}
                {isMain && check3x3BonusVisible(node, expandedIds) && (
                    <motion.div 
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [-10, -5, -10],
                        }}
                        transition={{
                            scale: { repeat: Infinity, duration: 2 },
                            rotate: { repeat: Infinity, duration: 3 }
                        }}
                        className="absolute -top-6 -left-6 bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)] border-2 border-yellow-200 z-50 flex items-center gap-1.5"
                    >
                        <Zap size={12} className="fill-white" />
                        BONUS 3x3 +150€
                    </motion.div>
                )}
                {/* User icon */}
                <div className={[
                    'p-1.5 sm:p-2.5 rounded-full mb-1 sm:mb-2 shadow-inner transition-transform group-hover:scale-110',
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
                    <span className="text-[10px] uppercase font-bold opacity-70 tracking-widest mt-0.5">{renderedRole}</span>
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
                        {calcEarnings(node)}
                    </motion.div>
                )}

                {/* Expand/Collapse Button */}
                {hasChildren && (
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleExpand(node.id); }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg hover:bg-slate-700 transition-all z-30"
                    >
                        {isExpanded ? <ChevronDown size={14} className="rotate-180" /> : <ChevronDown size={14} />}
                    </button>
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
                        className={`flex gap-4 sm:gap-16 relative justify-center px-4 ${isLevel3 ? 'mt-3 sm:mt-8' : 'mt-4 sm:mt-16'}`}
                    >
                        <svg className={`absolute left-0 w-full pointer-events-none overflow-visible z-10 no-export ${isLevel3 ? 'top-[-12px] sm:top-[-32px] h-3 sm:h-8' : 'top-[-16px] sm:top-[-64px] h-4 sm:h-16'}`}>
                            {node.children!.map((_, idx) => {
                                const total = node.children!.length;
                                const step = 100 / total;
                                const targetX = idx * step + step / 2;
                                const h = isLevel3 ? (window.innerWidth < 640 ? 12 : 32) : (window.innerWidth < 640 ? 16 : 64);
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
                                    theme={theme}
                                    onAdd={onAdd}
                                    onDelete={onDelete}
                                    onUpdate={onUpdate}
                                    isProjection={child.id.includes('ghost')}
                                    expandedIds={expandedIds}
                                    toggleExpand={toggleExpand}
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
                            toggleExpand(node.id); // Ensure parent is expanded when adding a child
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
    const [expandedIds, setExpandedIds] = useState<string[]>([]); // Start from zero (collapsed)
    const [filterRole, setFilterRole] = useState('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // Stats
    const totalMembers = countNodes(treeData) - 1; // exclude "me"
    const totalEarnings = calcTutorialEarnings(treeData, expandedIds);
    const has3x3Bonus = check3x3BonusVisible(treeData, expandedIds);
    const totalWithBonus = totalEarnings + (has3x3Bonus ? 150 : 0);
    const monthlyEarnings = calcMonthly(treeData, expandedIds);

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
                className="flex items-center justify-between mx-6 mb-2 gap-3 flex-wrap"
            >
                {/* Total members counter */}
                <motion.div
                    key={expandedIds.length} // Force re-render on expansion to update counter if needed
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm"
                >
                    <Users size={16} className="text-green-600" />
                    <div>
                        <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none">Membri Totali</p>
                        <p className="text-2xl font-black text-green-700 leading-none mt-0.5">{totalMembers}</p>
                    </div>
                </motion.div>

                {/* Estimated network earnings - TUM & Monthly */}
                <div className="flex gap-3">
                    <motion.div
                        key={totalWithBonus}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm"
                    >
                        <Euro size={16} className="text-emerald-600" />
                        <div>
                            <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none">Bonus Una Tantum</p>
                            <p className="text-2xl font-black text-emerald-700 leading-none mt-0.5">€{totalWithBonus}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        key={'monthly-' + monthlyEarnings}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-sm"
                    >
                        <Zap size={16} className="text-blue-600" />
                        <div>
                            <p className="text-[8px] uppercase font-black text-gray-400 tracking-widest leading-none">Rendita Mensile</p>
                            <p className="text-2xl font-black text-blue-700 leading-none mt-0.5">€{monthlyEarnings}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Filter dropdown removed as per request */}
            </motion.div>

            {/* Legend removed as per request */}

            {/* ── Zoom Controls ── */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 dark:border-white/10 z-50 no-export transition-all hover:scale-105">
                <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"><ZoomOut size={18} /></button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1" />
                <button onClick={handleResetZoom} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors font-bold text-xs">{Math.round(scale * 100)}%</button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1" />
                <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 transition-colors"><ZoomIn size={18} /></button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-2" />
                <button
                    onClick={() => { if (confirm('Resetta l\'albero? Rimarrai solo tu!')) { setTreeData({ id: 'me', label: 'Tu', role: 'Family Utility', level: -1, contracts: 0, children: [] }); setExpandedIds([]); } }}
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
                        expandedIds={expandedIds}
                        toggleExpand={toggleExpand}
                    />
                </div>
            </div>
        </div>
    );
};

export default CommunityTree;
