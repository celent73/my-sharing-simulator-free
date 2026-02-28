import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Check, Sparkles, Search, ArrowRight, Share2, Download, Hand } from 'lucide-react';
import { toPng } from 'html-to-image';
import { BRANDS_DATA, getIcon } from './CashbackData';

interface CashbackFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (categoryBaseId: string, brandName: string, amount?: number) => void;
    t: (key: string) => string;
    language: string;
}

// Extract unique categories from BRANDS_DATA
const AVAILABLE_CATEGORIES = Array.from(new Set(BRANDS_DATA.flatMap(b => b.categories)));

export const CashbackFocusMode: React.FC<CashbackFocusModeProps> = ({ isOpen, onClose, onSelect, t, language }) => {
    const [spendingAmount, setSpendingAmount] = useState<string>('');
    const [step, setStep] = useState<'category' | 'brand' | 'reveal'>('category');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<typeof BRANDS_DATA[0] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const reportRef = useRef<HTMLDivElement>(null);

    // Swipe Logic State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    // Local translations to fix missing keys/underscores
    const LABELS: Record<string, Record<string, string>> = {
        'cashback_detailed.select_category': {
            it: 'SCEGLI UNA CATEGORIA',
            de: 'KATEGORIE WÄHLEN',
            en: 'CHOOSE A CATEGORY'
        },
        'cashback_detailed.select_brand': {
            it: 'SELEZIONA BRAND',
            de: 'MARKE WÄHLEN',
            en: 'SELECT BRAND'
        },
        'cashback_detailed.return': {
            it: 'RITORNO CASHBACK',
            de: 'CASHBACK RÜCKVERGÜTUNG',
            en: 'CASHBACK RETURN'
        },
        'common.back': {
            it: 'INDIETRO',
            de: 'ZURÜCK',
            en: 'BACK'
        },
        'common.select': {
            it: 'SELEZIONA',
            de: 'AUSWÄHLEN',
            en: 'SELECT'
        },
        'cashback_detailed.insert_spending': {
            it: 'INSERISCI SPESA',
            de: 'AUSGABEN EINGEBEN',
            en: 'ENTER SPENDING'
        },
        'cashback_detailed.cat.alim': {
            it: 'Alimentari',
            de: 'Lebensmittel',
            en: 'Groceries'
        },
        'cashback_detailed.cat.igiene': {
            it: 'Igiene personale',
            de: 'Körperpflege',
            en: 'Personal Care'
        },
        'cashback_detailed.cat.carb': {
            it: 'Carburante',
            de: 'Kraftstoff',
            en: 'Fuel'
        },
        'cashback_detailed.cat.tech': {
            it: 'Hi-Tech',
            de: 'Elektronik & Tech',
            en: 'Hi-Tech'
        },
        'cashback_detailed.cat.treni': {
            it: 'Trasporti',
            de: 'Transport',
            en: 'Transport'
        },
        'cashback_detailed.cat.school': {
            it: 'Materiale scolastico',
            de: 'Schulmaterial',
            en: 'School Supplies'
        },
        'cashback_detailed.cat.abb': {
            it: 'Abbigliamento',
            de: 'Kleidung',
            en: 'Clothing'
        },
        'cashback_detailed.cat.casa': {
            it: 'Casa',
            de: 'Zuhause',
            en: 'Home'
        },
        'cashback_detailed.cat.regali': {
            it: 'Regali e Svago',
            de: 'Geschenke & Freizeit',
            en: 'Gifts & Leisure'
        },
        'cashback_detailed.cat.md': {
            it: 'Discount',
            de: 'Discounter',
            en: 'Discount'
        },
        'cashback_detailed.cat.aff_int': {
            it: 'Esempio affiliazioni internet',
            de: 'Beispiel Internet-Affiliates',
            en: 'Example Internet Affiliates'
        },
        'focus.annual_projection': {
            it: 'Proiezione 12 Mesi',
            de: '12-Monats-Prognose',
            en: '12-Month Projection'
        },
        'focus.share': {
            it: 'CONDIVIDI',
            de: 'TEILEN',
            en: 'SHARE'
        },
        'focus.swipe_hint': {
            it: 'Scorri per chiudere',
            de: 'Wischen zum Schließen',
            en: 'Swipe to close'
        },
        'focus.provider_question': {
            it: 'TE LI DA IL TUO GESTORE?',
            de: 'GIBT DEIN ANBIETER DIR DAS?',
            en: 'DOES YOUR PROVIDER GIVE THEM TO YOU?'
        }
    };

    const getLabel = (key: string) => {
        // Try global translation first
        const translated = t(key);
        // If it's a missing key (usually returns the key itself) or contains underscores, use local fallback
        if (translated === key || translated.includes('_')) {
            const langKey = (language === 'de' || language === 'en') ? language : 'it';
            return LABELS[key]?.[langKey] || LABELS[key]?.['it'] || key;
        }
        return translated;
    };

    useEffect(() => {
        if (!isOpen) {
            // Reset state on close
            setTimeout(() => {
                setStep('category');
                setSelectedCategory(null);
                setSelectedBrand(null);
                setSearchTerm('');
                setSpendingAmount('');
                setTouchStart(null);
                setTouchEnd(null);
            }, 500);
        } else {
            // Check for tutorial on open
            const hasSeenTutorial = localStorage.getItem('hasSeenFocusSwipeTutorial');
            if (!hasSeenTutorial) {
                setShowTutorial(true);
                // Hide after 4 seconds and mark as seen
                setTimeout(() => {
                    setShowTutorial(false);
                    localStorage.setItem('hasSeenFocusSwipeTutorial', 'true');
                }, 4000);
            }
        }
    }, [isOpen]);

    // Touch Event Handlers for Swipe
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // Reset
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isRightSwipe) {
            // Swipe right to close (like going back/closing modal on iOS)
            onClose();
        }
    };

    const handleCategorySelect = (cat: string) => {
        setSelectedCategory(cat);
        setStep('brand');
        setSearchTerm(''); // Clear search when entering brand step
    };

    const handleBrandSelect = (brand: typeof BRANDS_DATA[0]) => {
        setSelectedBrand(brand);
        setStep('reveal');
    };

    const handleConfirm = () => {
        if (selectedCategory && selectedBrand) {
            const amount = parseFloat(spendingAmount) || 0;
            onSelect(selectedCategory, selectedBrand.name, amount);
            onClose();
        }
    };

    const handleBack = () => {
        if (step === 'brand') {
            setStep('category');
            setSelectedCategory(null);
        } else if (step === 'reveal') {
            setStep('brand');
            setSelectedBrand(null);
        }
    };

    const handleShare = async () => {
        if (reportRef.current === null) return;

        try {
            const dataUrl = await toPng(reportRef.current, {
                cacheBust: true,
                backgroundColor: '#0f172a', // Ensure dark background
                style: {
                    borderRadius: '24px',
                    padding: '40px',
                }
            });

            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'sharing-simulator-result.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'My Sharing Simulator Focus Mode',
                    text: `Guarda il mio potenziale risparmio con ${selectedBrand?.name}!`,
                });
            } else {
                const link = document.createElement('a');
                link.download = 'sharing-simulator-result.png';
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error('Failed to share:', err);
            alert('Impossibile condividere l\'immagine al momento.');
        }
    };

    if (!isOpen) return null;

    // Filter brands based on category and search
    const filteredBrands = selectedCategory
        ? BRANDS_DATA.filter(b =>
            b.categories.includes(selectedCategory) &&
            b.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    // Helper to get category icon name
    const getCategoryIconName = (catId: string) => {
        switch (catId) {
            case 'alim': return 'ShoppingBag';
            case 'carb': return 'Car';
            case 'igiene': return 'ShoppingCart';
            case 'tech': return 'Calculator';
            case 'treni': return 'Plane';
            case 'school': return 'BookOpen';
            case 'abb': return 'Gift';
            case 'casa': return 'Home';
            case 'regali': return 'Gift';
            case 'md': return 'ShoppingBag';
            case 'aff_int': return 'Coffee';
            default: return 'Coffee';
        }
    };

    // Calculate cashback return based on input
    const parsedAmount = parseFloat(spendingAmount) || 0;
    const cashbackReturn = selectedBrand ? (parsedAmount * selectedBrand.percentage / 100) : 0;
    const annualProjection = cashbackReturn * 12;

    return (
        <div
            className="fixed inset-0 z-[100001] bg-black text-white flex flex-col overflow-hidden font-sans selection:bg-purple-500/30"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* AMBIENT BACKGROUND - DEEP & SUBTLE */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-purple-900/10 rounded-full blur-[150px] animate-[pulse_10s_infinite]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-indigo-900/10 rounded-full blur-[150px] animate-[pulse_12s_infinite_reverse]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
            </div>

            {/* TUTORIAL OVERLAY */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100002] pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    >
                        <div className="flex flex-col items-center">
                            <motion.div
                                animate={{ x: [0, 100, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                <Hand size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] rotate-90" />
                            </motion.div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 text-white font-bold text-lg bg-zinc-900/80 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md shadow-2xl"
                            >
                                {getLabel('focus.swipe_hint')}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <button
                    onClick={step === 'category' ? onClose : handleBack}
                    className="p-3 bg-zinc-800/40 hover:bg-zinc-700/60 rounded-full transition-all backdrop-blur-xl border border-white/5 active:scale-95 group"
                >
                    {step === 'category' ?
                        <X size={20} className="text-white/70 group-hover:text-white transition-colors" /> :
                        <ChevronLeft size={20} className="text-white/70 group-hover:text-white transition-colors" />
                    }
                </button>

                <div className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
                    Focus Mode
                </div>

                <div className="w-12" /> {/* Spacer */}
            </div>

            {/* CONTENT AREA */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-8 w-full max-w-7xl mx-auto h-full overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 'category' && (
                        <motion.div
                            key="step-category"
                            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="w-full h-full flex flex-col items-center justify-center"
                        >
                            <h2 className="text-2xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center text-white tracking-tight drop-shadow-lg">
                                {getLabel('cashback_detailed.select_category') || "Select Category"}
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 w-full max-w-5xl overflow-y-auto pb-24 custom-scrollbar px-2">
                                {AVAILABLE_CATEGORIES.map((cat, idx) => (
                                    <motion.button
                                        key={cat}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04, ease: "easeOut" }}
                                        onClick={() => handleCategorySelect(cat)}
                                        className="group relative aspect-square bg-zinc-900/40 hover:bg-zinc-800/60 border border-white/5 hover:border-white/20 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all duration-300 backdrop-blur-md shadow-lg hover:shadow-purple-900/20"
                                    >
                                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:bg-white/10 text-white/70 group-hover:text-white shadow-inner">
                                            {React.cloneElement(getIcon(getCategoryIconName(cat)), { size: 28, strokeWidth: 1.5 })}
                                        </div>
                                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors max-w-[80%] text-center leading-tight">
                                            {getLabel(`cashback_detailed.cat.${cat}`) || cat}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BRAND SELECTION */}
                    {step === 'brand' && selectedCategory && (
                        <motion.div
                            key="step-brand"
                            initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
                            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                            transition={{ duration: 0.4, ease: "circOut" }}
                            className="w-full max-w-3xl flex flex-col h-full"
                        >
                            <div className="flex-shrink-0 mb-6 sm:mb-8">
                                <h2 className="text-xl sm:text-3xl font-bold mb-6 flex items-center flex-wrap gap-2 sm:gap-3 px-1">
                                    <span className="text-white/40 font-medium">{getLabel(`cashback_detailed.cat.${selectedCategory}`) || selectedCategory}</span>
                                    <span className="text-white/20 text-sm">/</span>
                                    <span className="text-white tracking-tight">{getLabel('cashback_detailed.select_brand') || "Select Brand"}</span>
                                </h2>

                                {/* Search Bar - iOS Style */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-white/30 group-focus-within:text-white/80 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={getLabel('cashback_detailed.select_brand') + "..."}
                                        className="block w-full pl-11 pr-4 py-4 bg-zinc-900/60 border border-white/5 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-zinc-800/80 transition-all backdrop-blur-xl text-lg shadow-inner"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2 overflow-y-auto pb-24 custom-scrollbar pr-1 flex-grow content-start">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand, idx) => (
                                        <motion.button
                                            key={brand.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => handleBrandSelect(brand)}
                                            className="flex items-center justify-between p-4 bg-zinc-900/30 hover:bg-zinc-800/50 border border-white/5 hover:border-white/10 rounded-2xl group transition-all backdrop-blur-sm active:scale-[0.99]"
                                        >
                                            <span className="font-semibold text-lg text-white/80 group-hover:text-white text-left pl-2">{brand.name}</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 text-white/30 group-hover:text-white transition-colors">
                                                <ArrowRight size={14} />
                                            </div>
                                        </motion.button>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-white/20 py-12 italic font-light">
                                        No brands found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: REVEAL */}
                    {step === 'reveal' && selectedBrand && (
                        <motion.div
                            key="step-reveal"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                            className="flex flex-col items-center justify-center text-center relative w-full h-full max-w-lg mx-auto"
                        >
                            {/* WRAPPER FOR CAPTURE */}
                            <div ref={reportRef} className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-[3rem] transition-colors relative w-full overflow-visible">
                                {/* Background Explosion Effect (Subtle) */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                                    <div className="absolute w-[250px] h-[250px] bg-purple-600/20 rounded-full blur-[80px]" />
                                    <div className="absolute w-[150px] h-[150px] bg-indigo-500/10 rounded-full blur-[60px]" />
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="mb-8 text-white font-black text-4xl sm:text-6xl uppercase tracking-wider relative z-20 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] w-full text-center px-2 leading-tight"
                                >
                                    {selectedBrand.name}
                                </motion.div>

                                {/* SPENDING INPUT */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative z-30 mb-8 w-full flex flex-col items-center"
                                >
                                    <div className="mb-3 text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">
                                        {getLabel('cashback_detailed.insert_spending')}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 bg-zinc-900/60 border border-white/10 rounded-[2.5rem] py-6 px-10 backdrop-blur-xl shadow-2xl min-w-[200px] max-w-[300px]">
                                        <span className="text-5xl sm:text-6xl font-light text-white/50 mb-1">€</span>
                                        <input
                                            type="number"
                                            value={spendingAmount}
                                            onChange={(e) => setSpendingAmount(e.target.value)}
                                            placeholder="0"
                                            className="bg-transparent w-[140px] text-5xl sm:text-6xl font-bold text-white placeholder-white/10 focus:outline-none text-left leading-none"
                                            autoFocus
                                        />
                                    </div>
                                </motion.div>

                                <div className="relative z-10 w-full min-h-[180px] flex flex-col items-center justify-center">
                                    {parsedAmount > 0 ? (
                                        <div className="flex flex-col items-center">
                                            {/* RETURN LABEL MOVED HERE */}
                                            <motion.div
                                                className="mb-3 px-4 py-1.5 bg-zinc-900/40 border border-white/5 rounded-full text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {getLabel('cashback_detailed.return') + ` (${selectedBrand.percentage}%)`}
                                            </motion.div>

                                            <motion.div
                                                className="relative flex items-center justify-center gap-2 sm:gap-4"
                                                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                                key="cashback-amount"
                                            >
                                                {/* Stylized Star */}
                                                <motion.div
                                                    initial={{ rotate: -180, scale: 0 }}
                                                    animate={{ rotate: 12, scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                                >
                                                    <Sparkles size={40} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />
                                                </motion.div>

                                                <div className="text-5xl sm:text-7xl font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] pb-2 pr-2">
                                                    € {cashbackReturn.toLocaleString(language === 'de' ? 'de-DE' : 'it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            </motion.div>

                                            {/* PROVIDER PROVOCATION BUTTON */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="mt-8 flex flex-col items-center"
                                            >
                                                <motion.div
                                                    animate={{ scale: [1, 1.02, 1], boxShadow: ["0 0 0 rgba(234,179,8,0)", "0 0 20px rgba(234,179,8,0.3)", "0 0 0 rgba(234,179,8,0)"] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="px-8 py-4 rounded-full border border-yellow-500/30 bg-yellow-900/10 backdrop-blur-md shadow-lg flex items-center gap-3 relative overflow-hidden group"
                                                >
                                                    <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors" />
                                                    <span className="text-sm sm:text-base font-black text-yellow-100 tracking-[0.2em] uppercase drop-shadow-md relative z-10">
                                                        {getLabel('focus.provider_question')}
                                                    </span>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="text-[5rem] sm:text-[8rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-zinc-700 to-zinc-800 opacity-50"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {selectedBrand?.percentage}%
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <motion.div
                                className="mt-12 flex flex-col sm:flex-row gap-3 relative z-20 w-full max-w-sm px-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={handleShare}
                                        className="flex-1 px-6 py-4 bg-zinc-800/50 hover:bg-zinc-700/60 rounded-2xl text-white font-semibold backdrop-blur-xl transition-all flex items-center justify-center border border-white/5 hover:border-white/10 active:scale-95"
                                        title="Condividi"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                    <button
                                        onClick={handleBack}
                                        className="flex-[2] px-6 py-4 bg-zinc-800/50 hover:bg-zinc-700/60 rounded-2xl text-white/90 font-semibold backdrop-blur-xl transition-all border border-white/5 hover:border-white/10 active:scale-95 text-sm uppercase tracking-wide"
                                    >
                                        {getLabel('common.back') || "Back"}
                                    </button>
                                </div>
                                <button
                                    onClick={handleConfirm}
                                    className="w-full px-8 py-4 bg-white text-black rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
                                >
                                    <Check size={20} className="stroke-[3px]" />
                                    {getLabel('common.select') || "SELECT"}
                                </button>
                            </motion.div>

                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
