import React, { useEffect, useState, useRef } from 'react';
import { X, Users, Zap, Crown, ChevronDown, Minus, Plus, Settings, Star, User, RotateCcw, ShieldCheck, TrendingUp, Wallet, Download } from 'lucide-react';
import { PlanInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useCompensationPlan } from '../hooks/useSimulation';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import SharyTrigger from './SharyTrigger';

interface NetworkVisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: PlanInput;
  onInputChange: (field: keyof PlanInput, value: number) => void;
  onReset: () => void;
}

// --- STILI CSS INIETTATI ---
const styles = `
  /* GALAXY BACKGROUND ANIMATIONS */
  @keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
  }
  @keyframes twinkle {
    0% {opacity: 0.3; transform: scale(0.8);}
    50% {opacity: 1; transform: scale(1.2);}
    100% {opacity: 0.3; transform: scale(0.8);}
  }
  @keyframes pulse-glow {
    0% {box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);}
    50% {box-shadow: 0 0 25px rgba(59, 130, 246, 0.8), 0 0 50px rgba(168, 85, 247, 0.4);}
    100% {box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);}
  }
  @keyframes grid-move {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
  }

  /* CSS-ONLY STARS (Replaces external image to avoid CORS issues in PDF) */
  .stars-css {
    width: 2px;
    height: 2px;
    background: transparent;
    box-shadow: 10px 10px #FFF, 200px 500px #FFF, 400px 300px #FFF, 800px 100px #FFF, 1200px 800px #FFF, 1600px 400px #FFF; 
    animation: twinkle 5s infinite;
  }

  /* 3D GRID */
  .perspective-grid {
    position: absolute;
    bottom: -30%;
    left: -50%;
    width: 200%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(500px) rotateX(60deg);
    animation: grid-move 20s linear infinite;
    opacity: 0.1;
    z-index: 0;
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%);
  }

  .pallina-status {
    position: relative;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 10;
  }

  .pallina-status:hover {
    transform: scale(1.1);
    z-index: 50;
  }
  
  /* TOOLTIP */
  .pallina-tooltip {
    position: absolute;
    bottom: 140%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(15, 23, 42, 0.95);
    color: #e2e8f0;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    z-index: 100;
    pointer-events: none;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
  }

  .pallina-status:hover .pallina-tooltip,
  .pallina-status.show-tooltip .pallina-tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* EFFETTO ACTIVE PRO */
  .pallina-status.active-pro .pallina-inner {
    background: linear-gradient(135deg, #F59E0B 0%, #EA580C 100%) !important;
    box-shadow: 
      0 0 0 2px rgba(255, 255, 255, 0.2),
      0 0 20px rgba(234, 88, 12, 0.6),
      inset 0 0 10px rgba(255, 255, 255, 0.5) !important;
    border-color: #fff !important;
    transform: scale(1.15);
    z-index: 20;
    animation: pulse-glow 3s infinite ease-in-out;
  }
  
  .pallina-status.active-pro .pallina-icon {
    color: white !important;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
  }

  /* ENERGY LINES */
  @keyframes flowline {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .energy-line {
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(59, 130, 246, 0.3) 30%, 
      rgba(147, 51, 234, 0.8) 50%, 
      rgba(59, 130, 246, 0.3) 70%, 
      transparent 100%);
    background-size: 200% 100%;
    animation: flowline 3s linear infinite;
    filter: drop-shadow(0 0 4px rgba(147, 51, 234, 0.5));
  }
  
  .energy-line-vertical {
    width: 2px;
    background: linear-gradient(180deg, 
      rgba(59, 130, 246, 0.5) 0%, 
      rgba(147, 51, 234, 0.8) 50%, 
      rgba(59, 130, 246, 0.5) 100%);
    background-size: 100% 200%;
    animation: flowline 3s linear infinite;
    filter: drop-shadow(0 0 4px rgba(147, 51, 234, 0.5));
  }

  /* SHIMMER EFFECT */
  @keyframes shimmer {
    0% { transform: translateX(-100%) rotate(45deg); }
    100% { transform: translateX(200%) rotate(45deg); }
  }
  .shimmer-effect::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    animation: shimmer 5s infinite;
  }
`;

// --- TRADUZIONI ---
const texts = {
  it: {
    title: "La Tua Struttura",
    subtitle: "Esplora il tuo Universo di Business",
    reset: "Azzera Vista",
    export: "Salva PDF",
    rankReached: "Rank Attuale",
    makePro: "Attiva Family Pro",
    removePro: "Disattiva",
    directs: "Diretti",
    indirects: "Indiretti",
    levels: "Profondità",
    contracts: "Contratti",
    time: "Mesi",
    navHint: "Trascina per esplorare • Scorri per zoomare",
    rankDesc: { family5s: "5 Linee Family Pro", family3s: "3 Linee Family Pro", pro: "Obiettivo Rapido" },
    hud: {
      totalUsers: "Totale Utenti",
      potentialIncome: "Rendita Mensile (1° Anno)",
      potentialIncome2: "Rendita Mensile (2° Anno)",
      potentialIncome3: "Rendita Mensile (3° Anno)",
    }
  },
  de: {
    title: "Deine Struktur",
    subtitle: "Entdecke dein Business-Universum",
    reset: "Ansicht zurücksetzen",
    export: "PDF Speichern",
    rankReached: "Aktueller Rang",
    makePro: "Family Pro aktivieren",
    removePro: "Deaktivieren",
    directs: "Direkte",
    indirects: "Indirekte",
    levels: "Tiefe",
    contracts: "Verträge",
    time: "Monate",
    navHint: "Ziehen zum Bewegen • Scrollen zum Zoomen",
    rankDesc: { family5s: "5 Family Pro Linien", family3s: "3 Family Pro Linien", pro: "Schnelles Ziel" },
    hud: {
      totalUsers: "Totale Utenti",
      potentialIncome: "Rendita Mensile (1° Anno)",
      potentialIncome2: "Rendita Mensile (2° Anno)",
      potentialIncome3: "Rendita Mensile (3° Anno)",
    }
  },
  en: {
    title: "Your Structure",
    subtitle: "Explore your Business Universe",
    reset: "Reset View",
    export: "Save PDF",
    rankReached: "Current Rank",
    makePro: "Activate Family Pro",
    removePro: "Deactivate",
    directs: "Directs",
    indirects: "Indirects",
    levels: "Depth",
    contracts: "Contracts",
    time: "Months",
    navHint: "Drag to explore • Scroll to zoom",
    rankDesc: { family5s: "5 Family Pro Lines", family3s: "3 Family Pro Lines", pro: "Quick Goal" },
    hud: {
      totalUsers: "Total Users",
      potentialIncome: "Monthly Income (1st Year)",
      potentialIncome2: "Monthly Income (2nd Year)",
      potentialIncome3: "Monthly Income (3rd Year)",
    }
  }
};

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

const getRank = (activeLegs: number, directs: number, indirects: number, time: number, langTexts: any) => {
  if (activeLegs >= 5) return { name: 'FAMILY 5 S', color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/40 border-fuchsia-500', glow: 'shadow-[0_0_50px_rgba(217,70,239,0.4)]', icon: Crown, desc: langTexts.rankDesc.family5s };
  if (activeLegs >= 3) return { name: 'FAMILY 3 S', color: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-500', glow: 'shadow-[0_0_50px_rgba(234,179,8,0.4)]', icon: Star, desc: langTexts.rankDesc.family3s };
  if (directs >= 3 && indirects >= 3 && time <= 2) return { name: 'FAMILY PRO', color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-500', glow: 'shadow-[0_0_50px_rgba(6,182,212,0.4)]', icon: Zap, desc: langTexts.rankDesc.pro };
  return null;
};

// COMPONENTE NODO - STYLING MODERNO
const Node = ({ level, type, contracts, rankColor, isPro, onClick, txt }: { level: number, type: string, contracts: number, rankColor?: string, isPro?: boolean, onClick?: () => void, txt: any }) => {
  const getStyle = () => {
    if (type === 'root') {
      const baseStyle = { size: "w-16 h-16 md:w-20 md:h-20", icon: <Crown size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" /> };
      if (rankColor?.includes('fuchsia')) return { ...baseStyle, bg: "bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900", shadow: "shadow-[0_0_60px_rgba(217,70,239,0.8)]", border: "border-fuchsia-300" };
      if (rankColor?.includes('yellow')) return { ...baseStyle, bg: "bg-gradient-to-br from-yellow-500 via-orange-600 to-red-900", shadow: "shadow-[0_0_60px_rgba(234,179,8,0.8)]", border: "border-yellow-300" };
      if (rankColor?.includes('cyan')) return { ...baseStyle, bg: "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-900", shadow: "shadow-[0_0_60px_rgba(6,182,212,0.8)]", border: "border-cyan-300" };
      return { ...baseStyle, bg: "bg-gradient-to-br from-slate-600 to-slate-800", shadow: "shadow-[0_0_40px_rgba(148,163,184,0.3)]", border: "border-slate-500" };
    }
    if (type === 'direct' || type === 'indirect') {
      if (type === 'direct') return { bg: "bg-gradient-to-br from-blue-500 to-indigo-700", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]", border: "border-blue-400/50", size: "w-12 h-12 md:w-16 md:h-16", icon: <User size={20} className="text-white/90 pallina-icon" /> };
      return { bg: "bg-gradient-to-br from-violet-500 to-purple-800", shadow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]", border: "border-violet-400/50", size: "w-10 h-10 md:w-12 md:h-12", icon: <User size={16} className="text-white/80 pallina-icon" /> };
    }
    return { bg: "bg-gray-500", shadow: "", border: "", size: "w-8", icon: null };
  };

  const s = getStyle();
  const isClickable = type === 'direct' || type === 'indirect';
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`flex flex-col items-center relative z-10 mx-1 md:mx-2 group pallina-status ${isPro ? 'active-pro' : ''} ${isHovered ? 'show-tooltip' : ''}`}
      onClick={isClickable ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {level > 0 && <div className="h-6 md:h-10 w-0.5 energy-line-vertical mb-0.5 rounded-full opacity-60"></div>}

      {isClickable && (
        <div className="pallina-tooltip">
          {isPro ? txt.removePro : txt.makePro}
        </div>
      )}

      <div className={`pallina-inner ${s.size} rounded-full flex items-center justify-center ${s.bg} ${s.shadow} border-2 ${s.border} transition-all duration-300 relative ${isClickable ? 'cursor-pointer hover:scale-110 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]' : 'cursor-default'}`}>
        {isPro ? <ShieldCheck size={20} className="text-white drop-shadow-md animate-pulse" /> : s.icon}
        <div className="absolute -top-1 -right-1 bg-black/80 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white/20 shadow-lg z-20">L{level}</div>
      </div>

      {contracts > 0 && (
        <div className="flex gap-1 mt-2 bg-black/60 px-2 py-1 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
          {Array.from({ length: Math.min(contracts, 3) }).map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${contracts >= 2 ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-gray-600'}`} />
          ))}
          {contracts > 3 && <span className="text-[9px] text-gray-400 leading-none">+</span>}
        </div>
      )}
    </div>
  );
};

const MiniControl = ({ label, value, onChange, min, max, icon: Icon, color }: any) => (
  <div className="flex flex-col gap-2 min-w-full md:min-w-[130px] pointer-events-auto group">
    <div className="flex justify-between text-[11px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors">
      <span className="flex items-center gap-1.5"><Icon size={14} className={color} /> {label}</span>
      <span className="text-white font-mono text-xs">{value}</span>
    </div>
    <div className="flex items-center gap-2 bg-gray-900/80 md:bg-gray-900/60 backdrop-blur-sm rounded-xl p-2 md:p-1.5 border border-white/10 md:border-white/5 hover:border-white/20 transition-all shadow-lg">
      <button onClick={() => onChange(Math.max(min, value - 1))} className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center rounded-lg bg-white/10 md:bg-white/5 text-white hover:bg-white/20 active:scale-95 transition-all" type="button"><Minus size={14} /></button>
      <div className="flex-1 h-2 md:h-1.5 bg-gray-800 rounded-full overflow-hidden shadow-inner">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${(value / max) * 100}%`, boxShadow: '0 0 10px currentColor' }}></div>
      </div>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center rounded-lg bg-white/10 md:bg-white/5 text-white hover:bg-white/20 active:scale-95 transition-all" type="button"><Plus size={14} /></button>
    </div>
  </div>
);

// --- NUOVO COMPONENTE TOGGLE ---
const ToggleControl = ({ label, value, onChange, icon: Icon, color }: any) => (
  <div className="flex flex-col gap-2 min-w-[100px] md:min-w-[120px] pointer-events-auto group">
    <div className="flex justify-between text-[11px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors">
      <span className="flex items-center gap-1.5"><Icon size={14} className={value ? color : 'text-gray-500'} /> {label}</span>
    </div>
    <div
      onClick={() => onChange(!value)}
      className={`h-[42px] md:h-[34px] flex items-center bg-gray-900/80 md:bg-gray-900/60 backdrop-blur-sm rounded-xl px-1 border border-white/10 ${value ? 'border-yellow-500/50' : 'hover:border-white/20'} transition-all shadow-lg cursor-pointer relative overflow-hidden`}
    >
      <div className={`absolute inset-0 opacity-20 transition-opacity ${value ? 'bg-yellow-500' : 'bg-transparent'}`} />
      <div className={`w-full flex items-center justify-between px-2`}>
        <span className={`text-[9px] font-bold uppercase transition-colors ${value ? 'text-yellow-400' : 'text-gray-500'}`}>{value ? 'ATTIVO' : 'OFF'}</span>
        <div className={`w-8 h-4 md:w-6 md:h-3 rounded-full transition-colors relative ${value ? 'bg-yellow-500' : 'bg-gray-700'}`}>
          <div className={`absolute top-0.5 md:top-[1px] w-3 h-3 md:w-2.5 md:h-2.5 rounded-full bg-white transition-all shadow-sm ${value ? 'left-4 md:left-3' : 'left-0.5 md:left-0.5'}`} />
        </div>
      </div>
    </div>
  </div>
);

const DraggableBox = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only enable drag on mobile/touch devices or small screens if preferred, 
    // but user said "Sempre in modalità mobile" which implies the context is mobile view.
    // We can allow it always or just on touch. Pointer events work for both.
    // Prevent default to stop scrolling while dragging
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = { ...position };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: initialPosRef.current.x + dx,
      y: initialPosRef.current.y + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none', // Crucial for dragging on mobile without scrolling
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      className={`${className} transition-none`} // Disable transition during drag for smoothness
    >
      {children}
    </div>
  );
};

export const NetworkVisualizerModal: React.FC<NetworkVisualizerModalProps> = ({ isOpen, onClose, inputs, onInputChange, onReset }) => {
  const { language } = useLanguage();
  const txt = language === 'it' ? texts.it : (language === 'de' ? texts.de : texts.en);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [proStatusL1, setProStatusL1] = useState<boolean[]>([]);
  const [proStatusL2, setProStatusL2] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState(false);

  const { totalUsers, totalOneTimeBonus, totalRecurringYear1, totalRecurringYear2, totalRecurringYear3 } = useCompensationPlan(inputs);

  useEffect(() => {
    if (isOpen) {
      setZoom(window.innerWidth < 768 ? 0.6 : 0.9);
      setProStatusL1(new Array(inputs.directRecruits || 3).fill(false));
      setProStatusL2({});
    }
  }, [isOpen]);

  useEffect(() => {
    const d = inputs.directRecruits || 0;
    setProStatusL1(p => {
      if (p.length < d) return [...p, ...new Array(d - p.length).fill(false)];
      if (p.length > d) return p.slice(0, d);
      return p;
    });
  }, [inputs.directRecruits]);

  const handleExportPDF = async () => {
    const element = document.getElementById('network-modal');
    if (!element) return;
    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#050510'
      });

      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // 1. Fill background with dark color (to avoid white bars)
      pdf.setFillColor(5, 5, 16); // #050510
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // 2. Calculate dimensions to fit/fill
      const imgProps = pdf.getImageProperties(dataUrl);
      const imgRatio = imgProps.width / imgProps.height;
      const pageRatio = pdfWidth / pdfHeight;

      let finalWidth = pdfWidth;
      let finalHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If the calculated height is smaller than the page height, and we want to prevent white bars?
      // Actually, the background fill above (#050510) solves the "white bar" visual issue.
      // It makes the "empty" space look like part of the application.

      pdf.addImage(dataUrl, 'PNG', 0, 0, finalWidth, finalHeight);
      pdf.save('network-structure.pdf');
    } catch (err) {
      console.error('Failed to export PDF', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const directCount = inputs.directRecruits || 0;
  const indirectCount = inputs.indirectRecruits || 0;
  const depth = inputs.networkDepth || 1;
  const contracts = inputs.contractsPerUser || 0;
  const time = inputs.realizationTimeMonths || 12;
  const isBonus3x3Active = inputs.bonus3x3Active || false;
  const maxTime = 120;

  let activeLegs = 0;
  for (let i = 0; i < directCount; i++) {
    let isLegActive = proStatusL1[i] || false;
    if (!isLegActive) {
      for (let j = 0; j < indirectCount; j++) {
        if (proStatusL2[`${i}-${j}`]) {
          isLegActive = true;
          break;
        }
      }
    }
    if (isLegActive) activeLegs++;
  }

  const currentRank = getRank(activeLegs, directCount, indirectCount, time, txt);

  const handleNodeClick = (isPro: boolean, index: number, parentIndex?: number) => {
    if (navigator.vibrate) navigator.vibrate(30);
    if (parentIndex === undefined) { toggleProL1(index); } else { toggleProL2(parentIndex, index); }
  };

  const toggleProL1 = (index: number) => { setProStatusL1(prev => { const n = [...prev]; n[index] = !n[index]; return n; }); };
  const toggleProL2 = (parentIdx: number, childIdx: number) => { setProStatusL2(prev => ({ ...prev, [`${parentIdx}-${childIdx}`]: !prev[`${parentIdx}-${childIdx}`] })); };

  const handleResetClick = () => {
    setProStatusL1(new Array(directCount).fill(false));
    setProStatusL2({});
    if (onReset) onReset();
    setZoom(window.innerWidth < 768 ? 0.6 : 0.9);
  };

  const renderBranch = (currentLevel: number, isCentralBranch: boolean, parentIndex: number) => {
    if (currentLevel > depth) return null;
    let nodesToRender = 0;
    if (currentLevel === 1) nodesToRender = directCount;
    else if (currentLevel === 2) nodesToRender = indirectCount;
    else nodesToRender = isCentralBranch ? 1 : 0;

    if (nodesToRender === 0) return null;

    return (
      <div className="flex justify-center gap-2 md:gap-8 pt-4 relative">
        {nodesToRender > 1 && <div className="absolute top-4 left-4 right-4 h-[2px] energy-line rounded-full opacity-50"></div>}
        {Array.from({ length: nodesToRender }).map((_, idx) => {
          const isCenter = Math.floor(nodesToRender / 2) === idx;
          const shouldContinue = currentLevel < 2 || (isCentralBranch && isCenter);
          const isL1 = currentLevel === 1;
          const isL2 = currentLevel === 2;
          let isPro = false;

          if (isL1) { isPro = proStatusL1[idx] === true; }
          else if (isL2) { isPro = proStatusL2[`${parentIndex}-${idx}`] === true; }

          return (
            <div key={`${currentLevel}-${parentIndex}-${idx}`} className="flex flex-col items-center z-10">
              <Node
                level={currentLevel}
                type={isL1 ? 'direct' : 'indirect'}
                contracts={contracts}
                isPro={isPro}
                onClick={() => handleNodeClick(isPro, idx, isL2 ? parentIndex : undefined)}
                txt={txt}
              />
              {shouldContinue && renderBranch(currentLevel + 1, isCentralBranch && isCenter, idx)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div id="network-modal" className="fixed inset-0 z-[150] flex items-center justify-center bg-black animate-in fade-in duration-500 overflow-hidden" onClick={() => { }}>

        {/* --- GALAXY BACKGROUND LAYERS --- */}
        {/* 1. Deep Space Gradient - Pure OLED Dark */}
        <div className="absolute inset-0 bg-black z-0"></div>

        {/* 2. Stars Grid/Image */}
        <div className="absolute inset-0 z-0">
          <div className="stars-css absolute top-10 left-10 opacity-50"></div>
          <div className="stars-css absolute top-1/2 left-1/4 opacity-70" style={{ animationDelay: '1s' }}></div>
          <div className="stars-css absolute bottom-20 right-20 opacity-40" style={{ animationDelay: '2s' }}></div>
          {/* Dots Pattern */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
        </div>

        {/* 3. Nebula Glows - Subtler for v1.2.25 */}
        <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* 4. Vignette for Focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none z-[5]" />

        {/* 4. 3D GRID FLOOR */}
        <div className="perspective-grid pointer-events-none"></div>


        {/* --- HEADER UI --- */}
        <div className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">Interactive 3D</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/60 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">v1.2.47</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] tracking-tight">
              {txt.title}
            </h2>
            <p className="text-blue-200/80 text-xs md:text-lg font-medium max-w-md mt-2 shadow-black drop-shadow-md">
              {txt.subtitle}
            </p>
            <SharyTrigger
              message="Ti Piace questa schermata WOW? Benvenuto nell'universo del Networker! Prima di iniziare, azzera tutto con l'apposito pulsante di reset in alto a destra. In basso troverai i comandi, ti conviene impostare in profondità 5 livelli, dopodichè divertiti inserendo 3 diretti e vedrai le prime 3 palline. Clicca su 3 indiretti ed ecco la magia. Se vuoi diventare Family pro in 2 mesi allora dovrai scegliere come numero di mesi sulla destra 1 o 2 e vedrai la targa Family pro se clicchi su un pallino nelle 3 gambe distinte facendolo diventare un F.P. vedrai la targhetta Family 3S e se aggiungerai altri 2 diretti e accenderai altri 2 FP diventerai Family 5S"
              messageDe="Gefällt dir dieser WOW-Screen? Willkommen im Networker-Universum! Bevor du beginnst, setze alles mit dem Reset-Button oben rechts zurück. Unten findest du die Steuerungen. Am besten stellst du die Tiefe auf 5 Ebenen ein, dann habe Spaß daran, 3 direkte Partner einzufügen, und du wirst die ersten 3 Kugeln sehen. Klicke auf 3 indirekte und erlebe die Magie. Wenn du in 2 Monaten Family Pro werden willst, wähle rechts 1 oder 2 Monate, und du siehst das Family Pro-Abzeichen. Wenn du auf eine Kugel in den 3 verschiedenen Beinen klickst und sie zum F.P. machst, siehst du das Family 3S-Abzeichen. Fügst du 2 weitere Direkte hinzu und aktivierst 2 weitere FPs, wirst du Family 5S."
              messageEn="Do you like this WOW screen? Welcome to the Networker universe! Before starting, reset everything with the reset button at the top right. Below you will find the controls, it is best to set the depth to 5 levels, then have fun inserting 3 direct partners and you will see the first 3 balls. Click on 3 indirects and here is the magic. If you want to become Family Pro in 2 months then you will have to choose 1 or 2 months as the number of months on the right and you will see the Family Pro badge if you click on a ball in the 3 distinct legs making it an F.P. you will see the Family 3S badge and if you add 2 more directs and turn on 2 more FPs you will become Family 5S."
            />
          </div>

          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={handleExportPDF}
              className="p-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-200 rounded-full transition-all backdrop-blur-md hover:scale-110 active:scale-95 group"
              title={txt.export}
              disabled={isExporting}
            >
              <Download size={20} className={isExporting ? 'animate-bounce' : ''} />
            </button>
            <button onClick={handleResetClick} className="p-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full transition-all backdrop-blur-md hover:scale-110 active:scale-95 group" title={txt.reset}>
              <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
            </button>
            <button onClick={onClose} className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-full text-red-200 transition-all backdrop-blur-md border border-red-500/20 hover:scale-110 active:scale-95">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* --- HUD --- */}
        <DraggableBox className="absolute top-auto bottom-48 left-2 md:top-36 md:bottom-auto md:left-8 z-[60] pointer-events-auto animate-in slide-in-from-left-10 duration-700">
          <div className="bg-gray-950/40 backdrop-blur-2xl p-4 md:p-5 rounded-[2.5rem] border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4 w-[220px] md:w-80 relative overflow-hidden group hover:bg-gray-900/60 transition-all duration-500 transform scale-75 md:scale-100 origin-top-left ring-1 ring-white/5 shimmer-effect">

            {/* HUD Glow Effect */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 blur-[50px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 blur-[50px] group-hover:bg-purple-500/20 transition-all duration-700"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 rounded-2xl text-blue-400 border border-blue-500/20 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)] group-hover:scale-105 transition-transform">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">{txt.hud.totalUsers}</p>
                <p className="text-3xl font-black text-white leading-none tracking-tight">{totalUsers.toLocaleString()}</p>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>

            {/* --- GETTONE UNA TANTUM --- */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-600/30 rounded-2xl text-yellow-500 border border-yellow-500/20 shadow-[inset_0_0_15px_rgba(234,179,8,0.2)] group-hover:scale-105 transition-transform relative">
                <Zap size={20} />
                {isBonus3x3Active && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.15em] mb-0.5">Gettone Una Tantum</p>
                  {isBonus3x3Active && (
                    <span className="text-[9px] font-black text-yellow-400 animate-pulse bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">BONUS WIN!</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-3xl font-black text-white leading-tight tracking-tighter drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                    {formatCurrency(totalOneTimeBonus)}
                  </p>
                  {isBonus3x3Active && (
                    <p className="text-[10px] font-black text-yellow-400 flex items-center gap-1 mt-0.5 animate-in slide-in-from-left-2">
                      <Star size={10} fill="currentColor" /> Include € 150,00 Bonus 3x3
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-green-600/30 rounded-2xl text-emerald-400 border border-emerald-500/20 shadow-[inset_0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-105 transition-transform">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-[0.15em] mb-0.5">{txt.hud.potentialIncome}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black text-emerald-400 leading-none tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">{formatCurrency(totalRecurringYear1)}</p>
                  <span className="text-[10px] text-emerald-400/60 font-black tracking-tighter uppercase">/mo</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block space-y-3 mt-1">
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium px-1">
                <span>Year 2</span>
                <span className="text-blue-300 font-bold">{formatCurrency(totalRecurringYear2)}</span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500/50 w-full animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 font-medium px-1">
                <span>Year 3</span>
                <span className="text-purple-300 font-bold">{formatCurrency(totalRecurringYear3)}</span>
              </div>
            </div>

          </div>
        </DraggableBox>

        {/* --- RANK BADGE --- */}
        {currentRank && (
          <DraggableBox className="absolute top-auto bottom-48 right-4 md:top-28 md:bottom-auto md:right-auto md:left-1/2 md:-translate-x-1/2 z-40 animate-in slide-in-from-top-4 zoom-in fade-in duration-500 pointer-events-auto">
            <div className={`flex flex-col items-center gap-2 p-4 md:px-8 md:py-4 rounded-3xl border bg-black/40 backdrop-blur-2xl ${currentRank.bg} ${currentRank.glow} transition-all duration-500 transform scale-75 md:scale-100 origin-top-right md:origin-center`}>
              <currentRank.icon className={`${currentRank.color} drop-shadow-[0_0_10px_currentColor] animate-pulse`} size={32} />
              <div className="text-center">
                <p className="text-[9px] text-white/60 uppercase font-bold tracking-[0.2em] mb-1">{txt.rankReached}</p>
                <p className={`text-xl md:text-3xl font-black ${currentRank.color} drop-shadow-md tracking-wide leading-none`}>
                  {currentRank.name}
                </p>
              </div>
            </div>
          </DraggableBox>
        )}

        {/* --- MAIN GRAPH AREA --- */}
        <div
          ref={containerRef}
          className="w-full h-full overflow-auto custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] flex items-start pt-32 md:pt-40 pb-0 select-none cursor-grab active:cursor-grabbing relative z-20"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        >
          <div className="flex flex-col items-center min-w-max mx-auto p-4">
            <div className="flex flex-col items-center relative">
              {/* Central Glow */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl -z-10"></div>

              <Node level={0} type="root" contracts={inputs.contractsPerUser} rankColor={currentRank?.color} isPro={false} onClick={() => { }} txt={txt} />
              {renderBranch(1, true, 0)}
            </div>
          </div>
        </div>

        {/* --- NAVIGATION HINT (New) --- */}
        <div className="absolute bottom-32 md:bottom-36 left-1/2 -translate-x-1/2 z-30 pointer-events-none opacity-60 animate-bounce hidden md:flex flex-col items-center gap-2">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50">{txt.navHint}</p>
        </div>

        {/* --- CONTROLS FOOTER --- */}
        <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-auto pb-safe md:pb-8 flex justify-center">
          <div className="w-full md:w-auto mx-0 md:mx-4 p-4 md:p-3 bg-black/80 md:bg-black/60 backdrop-blur-2xl border-t md:border border-white/10 rounded-t-[2rem] md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-2 md:gap-4 ring-1 ring-white/5">
            <div className="grid grid-cols-2 md:flex w-full gap-3 md:gap-4 overflow-x-auto px-1 md:px-2 py-1 md:py-1 custom-scrollbar md:flex-1 md:justify-center">
              <MiniControl label={txt.directs} value={directCount} onChange={(v: number) => onInputChange('directRecruits', v)} min={0} max={15} icon={Users} color="text-orange-400" />
              <MiniControl label={txt.indirects} value={indirectCount} onChange={(v: number) => onInputChange('indirectRecruits', v)} min={0} max={10} icon={Users} color="text-purple-400" />
              <MiniControl label={txt.levels} value={depth} onChange={(v: number) => onInputChange('networkDepth', v)} min={1} max={5} icon={ChevronDown} color="text-green-400" />
              <MiniControl label={txt.contracts} value={contracts} onChange={(v: number) => onInputChange('contractsPerUser', v)} min={0} max={2} icon={Zap} color="text-cyan-400" />
              <div className="col-span-2 md:col-span-1 border-r border-white/5 md:pr-4">
                <MiniControl label={txt.time} value={time} onChange={(v: number) => onInputChange('realizationTimeMonths', v)} min={1} max={maxTime} icon={Settings} color="text-red-400" />
              </div>
              {/* TOGGLE BONUS 3x3 - VISIBILE SOLO SE 3x3 È SODDISFATTO */}
              {directCount >= 3 && contracts >= 1 && indirectCount >= 3 && (
                <div className="col-span-2 md:col-span-1 pl-0 md:pl-2 animate-in zoom-in duration-300">
                  <ToggleControl
                    label="BONUS 3x3 (60gg)"
                    value={isBonus3x3Active}
                    onChange={(v: boolean) => onInputChange('bonus3x3Active', v ? 1 : 0)}
                    icon={Star}
                    color="text-yellow-400"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
