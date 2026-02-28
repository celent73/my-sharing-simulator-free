import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, ChevronDown, Check, X, ZoomIn, ZoomOut, Maximize, Trash2 } from 'lucide-react';

interface NodeData {
    id: string;
    label: string;
    role: string;
    level: number;
    children?: NodeData[];
}

const INITIAL_TREE_DATA: NodeData = {
    id: 'me',
    label: 'Tu',
    role: 'Family Pro',
    level: 0,
    children: [
        {
            id: 'marco',
            label: 'Marco G.',
            role: 'Family',
            level: 1,
            children: [
                {
                    id: 'anna',
                    label: 'Anna L.',
                    role: 'Member',
                    level: 2,
                    children: [
                        { id: 'filippo', label: 'Filippo', role: 'Member', level: 3 },
                        { id: 'elisa', label: 'Elisa', role: 'Member', level: 3 },
                    ]
                },
                { id: 'luca', label: 'Luca B.', role: 'Member', level: 2 },
            ]
        },
        {
            id: 'elena',
            label: 'Elena R.',
            role: 'Family',
            level: 1,
            children: [
                {
                    id: 'sara',
                    label: 'Sara M.',
                    role: 'Member',
                    level: 2,
                    children: [
                        { id: 'matteo', label: 'Matteo', role: 'Member', level: 3 },
                    ]
                },
            ]
        },
        {
            id: 'pietro',
            label: 'Pietro V.',
            role: 'Family Pro',
            level: 1,
            children: [
                { id: 'giulia', label: 'Giulia S.', role: 'Member', level: 2 },
                {
                    id: 'davide',
                    label: 'Davide N.',
                    role: 'Member',
                    level: 2,
                    children: [
                        { id: 'chiara', label: 'Chiara', role: 'Member', level: 3 },
                        { id: 'fabio', label: 'Fabio', role: 'Member', level: 3 },
                    ]
                },
            ]
        }
    ]
};

const TreeNodeComponent = ({ node, onUpdate, theme, isProjection }: { node: NodeData; onUpdate: (id: string, newLabel: string) => void; theme: string; isProjection?: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(node.label);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasChildren = node.children && node.children.length > 0;
    const isMain = node.level === 0;
    const isLevel3 = node.level >= 3;

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        onUpdate(node.id, editValue);
        setIsEditing(false);
    };

    const nodeStyles = {
        glass: isMain
            ? 'bg-gradient-to-br from-union-green-500 to-union-green-600 text-white shadow-[0_10px_30px_rgba(34,197,94,0.3)] border-white/20'
            : isLevel3
                ? 'bg-white/80 text-slate-800 border-white/60 shadow-sm backdrop-blur-md'
                : 'bg-white/90 text-slate-900 border-white/60 shadow-[0_8px_20px_rgba(0,0,0,0.04)] backdrop-blur-xl',
        dark: isMain
            ? 'bg-gradient-to-br from-yellow-600 to-amber-700 text-white border-yellow-400/30'
            : isLevel3
                ? 'bg-zinc-900/80 text-zinc-100 border-white/5 backdrop-blur-md'
                : 'bg-zinc-900/90 text-white border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-xl',
        minimal: isMain
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-gray-200 shadow-sm'
    };

    const connectorColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    return (
        <div className="flex flex-col items-center relative">
            <motion.div
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`
          relative rounded-[1.5rem] border z-20 transition-all duration-300
          ${nodeStyles[theme as keyof typeof nodeStyles]}
          ${isMain ? 'p-5 min-w-[140px]' : isLevel3 ? 'p-2.5 min-w-[100px]' : 'p-4 min-w-[140px]'}
          ${isProjection ? 'opacity-50 grayscale scale-95 border-dashed' : ''}
          flex flex-col items-center group hover:scale-105
        `}
            >
                <div className={`
          p-2.5 rounded-full mb-2 shadow-inner
          ${isMain ? 'bg-white/20 text-white' : theme === 'dark' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-union-green-500/10 text-union-green-600'}
          ${isLevel3 ? 'scale-75 mb-0' : ''}
        `}>
                    {isMain ? <User size={isLevel3 ? 16 : 22} /> : <Users size={isLevel3 ? 14 : 20} />}
                </div>

                {isEditing ? (
                    <div className="flex flex-col items-center gap-2 mt-1">
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setIsEditing(false); }}
                            onBlur={handleSave}
                            className="bg-transparent border-b-2 border-current rounded-none px-1 py-0.5 text-xs font-bold text-center w-24 outline-none no-export"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => !isProjection && setIsEditing(true)}
                        className="group flex flex-col items-center cursor-pointer"
                        title="Clicca per modificare"
                    >
                        <span className={`font-black ${isLevel3 ? 'text-[11px]' : 'text-sm'} tracking-tight leading-tight mb-0.5`}>{node.label}</span>
                        <span className={`${isLevel3 ? 'text-[8px]' : 'text-[10px]'} uppercase font-bold opacity-50 tracking-widest`}>{node.role}</span>
                    </div>
                )}

                {hasChildren && (
                    <div
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                        className={`absolute -bottom-3 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm border border-white/50 backdrop-blur-sm z-30 ${isExpanded ? 'bg-white text-slate-800 rotate-180' : 'bg-slate-800 text-white'}`}
                    >
                        <ChevronDown size={12} strokeWidth={3} />
                    </div>
                )}
            </motion.div>

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
                                const targetX = (idx * step) + (step / 2);
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
                        {node.children!.map((child) => (
                            <TreeNodeComponent key={child.id} node={child} onUpdate={onUpdate} theme={theme} isProjection={child.id.includes('ghost')} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

interface TreeProps {
    theme?: 'glass' | 'dark' | 'minimal';
    isProjectionMode?: boolean;
}

const CommunityTree = ({ theme = 'glass', isProjectionMode = false }: TreeProps) => {
    const [treeData, setTreeData] = useState<NodeData>(INITIAL_TREE_DATA);
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);
    const [manualZoom, setManualZoom] = useState(false);

    const displayData = React.useMemo(() => {
        if (!isProjectionMode) return treeData;

        const injectGhosts = (node: NodeData): NodeData => {
            const children = node.children ? node.children.map(injectGhosts) : [];
            if (node.level < 3) {
                const currentCount = children.length;
                const targetCount = node.level === 0 ? 4 : 2;
                for (let i = currentCount; i < targetCount; i++) {
                    children.push({
                        id: `ghost-${node.id}-${i}`,
                        label: 'Nuovo Partner',
                        role: 'Potential',
                        level: node.level + 1,
                    });
                }
            }
            return { ...node, children };
        };

        return injectGhosts(treeData);
    }, [treeData, isProjectionMode]);

    const handleAutoResize = () => {
        if (containerRef.current && !manualZoom) {
            const viewportWidth = window.innerWidth - 64;
            const contentWidth = containerRef.current.scrollWidth;
            setScale(contentWidth > viewportWidth ? Math.max(0.3, viewportWidth / contentWidth) : 1);
        }
    };

    useEffect(() => {
        handleAutoResize();
        window.addEventListener('resize', handleAutoResize);
        return () => window.removeEventListener('resize', handleAutoResize);
    }, [displayData, manualZoom]);

    const updateNodeLabel = (id: string, newLabel: string) => {
        const updateRecursive = (current: NodeData): NodeData => {
            if (current.id === id) return { ...current, label: newLabel };
            if (current.children) return { ...current, children: current.children.map(updateRecursive) };
            return current;
        };
        setTreeData(updateRecursive(treeData));
    };

    const handleZoomIn = () => {
        setManualZoom(true);
        setScale(prev => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setManualZoom(true);
        setScale(prev => Math.max(prev - 0.1, 0.2));
    };

    const handleResetZoom = () => {
        setManualZoom(false);
        setTimeout(handleAutoResize, 10);
    };

    return (
        <div className={`pt-0 pb-16 overflow-hidden no-scrollbar rounded-[2rem] min-h-[600px] transition-colors duration-500 relative ${theme === 'dark' ? 'bg-zinc-950/20' : 'bg-transparent'}`} id="export-card-tree">

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50 dark:border-white/10 z-50 no-export transition-all hover:scale-105 hover:bg-white dark:hover:bg-zinc-900">
                <button onClick={handleZoomOut} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
                    <ZoomOut size={18} />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1"></div>
                <button onClick={handleResetZoom} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors font-bold text-xs" title="Adatta allo schermo">
                    {Math.round(scale * 100)}%
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-1"></div>
                <button onClick={handleZoomIn} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors">
                    <ZoomIn size={18} />
                </button>

                <div className="w-px h-4 bg-gray-300 dark:bg-white/10 mx-2"></div>

                <button
                    onClick={() => {
                        if (confirm('Sei sicuro di voler resettare l\'albero? Rimarrai solo tu!')) {
                            setTreeData({
                                id: 'me', label: 'Tu', role: 'Family Pro', level: 0, children: []
                            });
                        }
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 text-gray-400 transition-colors"
                    title="Resetta Albero"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div
                className="transition-transform duration-500 origin-top flex justify-center pt-0 pb-20"
                style={{ transform: `scale(${scale})` }}
            >
                <div ref={containerRef} className="px-10 pb-20">
                    <TreeNodeComponent node={displayData} onUpdate={updateNodeLabel} theme={theme} />
                </div>
            </div>
        </div>
    );
};

export default CommunityTree;
