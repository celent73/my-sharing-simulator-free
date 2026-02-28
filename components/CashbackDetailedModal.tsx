import React, { useState, useEffect, useRef } from 'react';
import { X, Calculator, RefreshCw, ShoppingBag, Car, ShoppingCart, Gift, Plane, Home, BookOpen, Coffee, Check, Trash2, PlusCircle, RotateCcw, RotateCw, MoreVertical, Camera, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { CashbackCategory } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';
import { BRANDS_DATA, getIcon } from './CashbackData';
import { CashbackFocusMode } from './CashbackFocusMode';

interface CashbackDetailedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (totalSpending: number, totalCashback: number, details: CashbackCategory[]) => void;
    initialDetails?: CashbackCategory[];
}


const uiTexts = {
    it: {
        title: "Calcolatore Cashback PRO",
        subtitle: "Personalizza le tue spese mensili per categoria",
        totalSpend: "Spesa Totale",
        monthlyReturn: "Ritorno Mensile",
        selectBrand: "SELEZIONA BRAND",
        other: "ALTRO...",
        return: "ritorno",
        reset: "RESET",
        confirm: "CONFERMA",
        addCategory: "Aggiungi Altra Categoria",
        categories: "categorie",
        cat: {
            alim: "Alimentari",
            igiene: "Igiene personale",
            carb: "Carburante",
            tech: "Hi-Tech",
            treni: "Trasporti",
            school: "Materiale scolastico",
            abb: "Abbigliamento",
            casa: "Casa",
            regali: "Regali e Svago",
            md: "Discount",
            aff_int: "Esempio affiliazioni internet",
        },
        estimatedBill: "BOLLETTA STIMATA",
        payOnly: "Paghi solo",
        profit: "GUADAGNI",
        save: "Risparmi",
        billZero: "RECHNUNG AUF NULL!",
        coveredPart: "Hai coperto il",
        extra: "extra!"
    },
    de: {
        title: "Cashback Rechner PRO",
        subtitle: "Personalisiere deine monatlichen Ausgaben nach Kategorie",
        totalSpend: "Gesamtausgaben",
        monthlyReturn: "Monatliche Rückvergütung",
        selectBrand: "MARKE WÄHLEN",
        other: "ANDERE...",
        return: "Rückvergütung",
        reset: "RESET",
        confirm: "CONFERMA",
        addCategory: "Kategorie hinzufügen",
        categories: "Kategorien",
        cat: {
            alim: "Lebensmittel",
            igiene: "Persönliche Pflege",
            carb: "Treibstoff",
            tech: "Elektronik & Tech",
            treni: "Transport",
            school: "Schulmaterial",
            abb: "Kleidung",
            casa: "Zuhause",
            regali: "Geschenke & Freizeit",
            md: "Discounter",
            aff_int: "Internet-Affiliates Beispiel",
        },
        estimatedBill: "GESCHÄTZTE RECHNUNG",
        payOnly: "Nur noch",
        profit: "GEWINN",
        save: "Ersparnis",
        billZero: "RECHNUNG AUF NULL!",
        coveredPart: "Sie haben",
        extra: "extra!"
    }
};

export const CashbackDetailedModal: React.FC<CashbackDetailedModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialDetails
}) => {
    const { language, t } = useLanguage();
    // Default to 'it' if language is undefined or not supported
    const lang = (language === 'de') ? 'de' : 'it';
    const txt = uiTexts[lang];
    const modalRef = useRef<HTMLDivElement>(null);



    const defaultCategories: CashbackCategory[] = [
        { id: 'alim_1', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'alim_2', name: txt.cat.alim, amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'igiene_1', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'igiene_2', name: txt.cat.igiene, amount: 0, brand: '', percentage: 0, icon: 'ShoppingCart' },
        { id: 'carb_1', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'carb_2', name: txt.cat.carb, amount: 0, brand: '', percentage: 0, icon: 'Car' },
        { id: 'tech_1', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },
        { id: 'tech_2', name: txt.cat.tech, amount: 0, brand: '', percentage: 0, icon: 'Calculator' },

        { id: 'treni_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'treni_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Plane' },
        { id: 'school_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'school_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'BookOpen' },
        { id: 'abb_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'abb_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'casa_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'casa_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Home' },
        { id: 'regali_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'regali_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'Gift' },
        { id: 'aff_int_1', name: '', amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
        { id: 'aff_int_2', name: '', amount: 0, brand: '', percentage: 0, icon: 'ShoppingBag' },
    ];

    const [categories, setCategories] = useState<CashbackCategory[]>(defaultCategories);
    const [targetBill, setTargetBill] = useState<number>(0);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    // Update categories when language changes
    useEffect(() => {
        setCategories(prev => prev.map(cat => {
            const baseId = cat.id.replace(/_\d+$/, '');
            // Get translation using baseId as key
            const translatedName = t(`cashback_detailed.cat.${baseId}`);
            return {
                ...cat,
                name: translatedName !== `cashback_detailed.cat.${baseId}` ? translatedName : (baseId === 'md' ? 'Discount' : cat.name)
            };
        }));
    }, [language, t]);

    useEffect(() => {
        if (isOpen) {
            handleReset();
        }
    }, [isOpen]);

    useEffect(() => {
        if (initialDetails && initialDetails.length > 0 && !isOpen) {
            const initialMap = new Map(initialDetails.map(d => [d.id, d]));

            const merged = defaultCategories.map(defCat => {
                const saved = initialMap.get(defCat.id);
                const baseId = defCat.id.replace(/_\d+$/, '');
                const translatedName = t(`cashback_detailed.cat.${baseId}`);

                if (saved) {
                    return {
                        ...defCat,
                        name: translatedName,
                        amount: saved.amount,
                        brand: saved.brand,
                        percentage: saved.percentage,
                    };
                }
                return { ...defCat, name: translatedName };
            });
            setCategories(merged);
        } else {
            // Re-initialize names potentially
            setCategories(prev => prev.map(cat => {
                const baseId = cat.id.replace(/_\d+$/, '');
                const translatedName = t(`cashback_detailed.cat.${baseId}`);
                return { ...cat, name: translatedName };
            }));
        }
    }, [initialDetails, isOpen, language, t]); // Add t and language dep

    const handleUpdate = (id: string, field: keyof CashbackCategory, value: string | number) => {
        setCategories(prev => prev.map(cat => {
            if (cat.id === id) {
                if (field === 'brand') {
                    const brandData = BRANDS_DATA.find(b => b.name === value);
                    return {
                        ...cat,
                        brand: value as string,
                        percentage: brandData ? brandData.percentage : cat.percentage,
                        fixedAmount: brandData ? brandData.fixedAmount : undefined
                    };
                }
                return { ...cat, [field]: value };
            }
            return cat;
        }));
    };

    const handleReset = () => {
        setCategories(categories.map(cat => ({ ...cat, amount: 0, brand: '', percentage: 0, fixedAmount: undefined })));
        setTargetBill(0);
    };

    const handleFocusModeSelect = (categoryBaseId: string, brandName: string, amount?: number) => {
        const brandData = BRANDS_DATA.find(b => b.name === brandName);
        if (!brandData) return;

        setCategories(prev => {
            const newCategories = [...prev];
            // Find all slots for this category
            const slots = newCategories.map((c, i) => ({ ...c, index: i }))
                .filter(c => c.id.startsWith(categoryBaseId));

            if (slots.length === 0) return prev;

            // Try to find the first empty slot (no brand selected)
            let targetSlotIndex = slots.find(s => !s.brand)?.index;

            // If no empty slot, use the first slot or maybe overwrite the one with same brand? 
            // For now default behavior: first slot if all full?
            if (targetSlotIndex === undefined) {
                targetSlotIndex = slots[0].index;
            }

            // Update the slot
            newCategories[targetSlotIndex] = {
                ...newCategories[targetSlotIndex],
                brand: brandName,
                percentage: brandData.percentage,
                fixedAmount: brandData.fixedAmount,
                // If amount is passed, use it, otherwise keep existing
                amount: amount !== undefined ? amount : newCategories[targetSlotIndex].amount
            };

            return newCategories;
        });
    };

    // Calculate totals
    const totalSpend = categories.reduce((sum, cat) => sum + cat.amount, 0);
    const totalCashback = categories.reduce((sum, cat) => {
        if (cat.fixedAmount !== undefined) {
            return sum + (cat.brand ? cat.fixedAmount : 0);
        }
        return sum + (cat.amount * cat.percentage / 100);
    }, 0);

    // Calculate averages and bill coverage
    const averagePercentage = totalSpend > 0 ? (totalCashback / totalSpend) * 100 : 0;

    // Bill Eraser Logic
    const percentageCovered = targetBill > 0 ? (totalCashback / targetBill) * 100 : 0;
    const isBillCovered = targetBill > 0 && totalCashback >= targetBill;
    const remainingToPay = Math.max(0, targetBill - totalCashback);
    const extraProfit = Math.max(0, totalCashback - targetBill);
    const discountPercent = Math.min(100, percentageCovered);

    if (!isOpen) return null;

    return (
        <div ref={modalRef} className="fixed inset-0 z-[100000] flex items-center justify-center p-0 sm:p-2 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
            <div className="share-modal-content bg-white/80 dark:bg-gray-950/80 backdrop-blur-[50px] w-full h-full sm:h-auto sm:max-w-[90vw] xl:max-w-7xl sm:rounded-[3.5rem] shadow-2xl flex flex-col max-h-[100vh] sm:max-h-[92vh] overflow-hidden border border-white/40 dark:border-white/10">

                {/* Header */}
                {/* Header - MIDNIGHT GLASS STYLE */}
                <div className="p-3 sm:px-10 sm:py-6 bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl text-slate-900 dark:text-white shrink-0 relative overflow-hidden flex flex-col gap-4 border-b border-gray-200/30 dark:border-white/5">
                    {/* Background decorations - Minimized */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner">
                                <Sparkles size={20} className="animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                                    {t('cashback_detailed.title')}
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mt-2">Professional calculation tools</p>
                            </div>
                            <SharyTrigger
                                message="Inserisci per ogni categoria l'importo di spesa e poi seleziona il brand che vuoi. Nota immediatamente la percentuale di cashback! E se vuoi, imposta in alto un importo di bolletta e osserva come diminuisce con il cashback, buon divertimento!"
                                messageDe="Gib für jede Kategorie den Ausgabenbetrag ein und wähle dann die gewünschte Marke. Beachte sofort den Cashback-Prozentsatz! Und wenn du willst, gib oben einen Rechnungsbetrag ein und beobachte, wie er durch das Cashback sinkt. Viel Spaß!"
                                messageEn="Enter the spending amount for each category and then select the brand you want. Notice the cashback percentage immediately! And if you want, set a bill amount at the top and watch how it decreases with cashback, have fun!"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            {/* "DON'T LOSE THEM" BADGE - PROMINENT */}
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg animate-bounce"
                            >
                                <Sparkles size={14} className="animate-pulse" />
                                {t('cashback_detailed.dont_lose') || 'Non Perderli!'}
                            </motion.div>

                            <button
                                onClick={() => setIsFocusModeOpen(true)}
                                className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Eye size={14} />
                                <span className="hidden lg:inline">{t('cashback_detailed.focus_mode') || 'Focus Mode'}</span>
                            </button>

                            <button onClick={onClose} className="p-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full transition-all text-slate-400">
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-4 relative z-10">
                        {/* Totals Section */}
                        <div className="grid grid-cols-2 gap-4 shrink-0 xl:w-[450px]">
                            <div className="bg-gray-100/60 dark:bg-white/5 backdrop-blur-xl rounded-[1.8rem] p-4 border border-gray-200/50 dark:border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('cashback_detailed.total_spend')}</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">€ {totalSpend.toLocaleString(lang, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.8rem] p-4 shadow-xl shadow-indigo-500/20">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/70">{t('cashback_detailed.monthly_return')}</p>
                                    <span className="sm:hidden text-[8px] px-2 py-0.5 bg-white/20 text-white rounded-full font-black uppercase tracking-tighter">{t('cashback_detailed.dont_lose')}</span>
                                </div>
                                <p className="text-2xl sm:text-4xl font-black text-white tracking-tighter drop-shadow-md">€ {totalCashback.toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Bill Section - Now horizontal and slim */}
                        <div className="flex-1 bg-gray-100/60 dark:bg-white/5 backdrop-blur-xl rounded-[1.8rem] p-4 sm:px-6 border border-gray-200/50 dark:border-white/5 flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg">
                                    <Calculator size={16} />
                                </div>
                                <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.15em]">{t('cashback_detailed.estimated_bill')}</span>
                            </div>

                            <div className="flex-1 flex items-stretch gap-3 w-full">
                                <div className="relative flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-transparent focus-within:border-blue-500/50 overflow-hidden shadow-inner flex items-center px-4 py-2">
                                    <span className="text-lg font-black text-slate-300 mr-2">€</span>
                                    <input
                                        type="number"
                                        value={targetBill || ''}
                                        onChange={(e) => setTargetBill(Math.max(0, parseFloat(e.target.value) || 0))}
                                        onFocus={(e) => e.target.select()}
                                        placeholder="0"
                                        className="w-full bg-transparent text-lg font-black text-slate-900 dark:text-white outline-none"
                                    />
                                    <button onClick={() => setTargetBill(0)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                        <RotateCw size={16} />
                                    </button>
                                </div>

                                <div className={`flex-[1.5] rounded-2xl px-6 py-2 flex items-center justify-between shadow-xl transition-all duration-500 transform hover:scale-[1.02] ${extraProfit > 0 ? 'bg-green-500 shadow-green-500/30' : 'bg-slate-900 dark:bg-white shadow-slate-900/30 dark:shadow-white/10'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${extraProfit > 0 ? 'text-white/80' : 'text-slate-500'}`}>
                                        {extraProfit > 0 ? t('cashback_detailed.profit') : t('cashback_detailed.pay_only')}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-xl sm:text-2xl font-black tracking-tighter ${extraProfit > 0 || remainingToPay === 0 ? 'text-white' : 'text-white dark:text-slate-900'}`}>
                                            €{extraProfit > 0 ? extraProfit.toFixed(0) : remainingToPay.toFixed(0)}
                                        </p>
                                        {totalCashback > 0 && remainingToPay > 0 && (
                                            <span className="text-[10px] px-2 py-1 bg-white/20 text-white rounded-full font-black border border-white/20 backdrop-blur-md">-{Math.min(100, percentageCovered).toFixed(0)}%</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:block w-24 h-1.5 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden p-[1px]">
                                <motion.div
                                    animate={{ width: `${Math.min(100, percentageCovered)}%` }}
                                    className={`h-full rounded-full ${percentageCovered >= 100 ? 'bg-white' : 'bg-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-gray-50/10 dark:bg-gray-950/20 backdrop-blur-md custom-scrollbar">
                    <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                        {categories.map((cat) => (
                            <div key={cat.id} className="bg-white dark:bg-slate-900/40 p-5 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-white/5 transition-all group hover:shadow-2xl hover:shadow-blue-500/10 h-full flex flex-col justify-center">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
                                    {/* LEFT SECTION: Icon + Name */}
                                    <div className="flex items-center justify-between sm:justify-start sm:w-[38%] shrink-0">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner ${cat.isExtra ? 'bg-orange-500/10 text-orange-600' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                                                {React.cloneElement(getIcon(cat.icon), { size: 28 })}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-lg text-slate-900 dark:text-white truncate tracking-tighter uppercase leading-tight">{cat.name}</h3>
                                                <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">{cat.isExtra ? 'Promozione' : 'Budget Famiglia'}</p>
                                            </div>
                                        </div>
                                        {/* Mobile Result (Hidden sm) */}
                                        <div className="text-right sm:hidden">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block mb-1">Cashback</span>
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={cat.percentage + (cat.brand || '')}
                                                    className={`font-black text-3xl ${cat.amount > 0 && cat.percentage > 0 ? 'text-blue-500 animate-pulse' : 'text-slate-900 dark:text-white'}`}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                >
                                                    € {cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(0) : '0') : (cat.amount * cat.percentage / 100).toLocaleString(lang, { maximumFractionDigits: 0 })}
                                                </motion.p>
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* RIGHT SECTION: Inputs Grid */}
                                    <div className="grid grid-cols-12 sm:flex-1 items-center gap-4">

                                        {/* Amount Input - iOS Pill */}
                                        <div className="col-span-5 sm:flex-1 relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm">€</div>
                                            <input
                                                type="number"
                                                value={cat.amount || ''}
                                                onChange={(e) => handleUpdate(cat.id, 'amount', parseFloat(e.target.value) || 0)}
                                                onFocus={(e) => e.target.select()}
                                                placeholder="0"
                                                className="w-full pl-8 pr-4 py-4 bg-gray-50 dark:bg-white/5 rounded-full text-right font-black text-lg text-slate-900 dark:text-white border-2 border-slate-300 dark:border-white/20 focus:border-blue-500/50 outline-none transition-all shadow-inner"
                                            />
                                        </div>

                                        {/* Brand Dropdown - iOS Select */}
                                        <div className="col-span-12 sm:col-span-4 sm:flex-[1.8] relative group/select">
                                            <select
                                                value={cat.brand}
                                                onChange={(e) => handleUpdate(cat.id, 'brand', e.target.value)}
                                                className={`w-full py-4 px-6 rounded-full text-[10px] sm:text-xs font-black tracking-widest uppercase border-2 outline-none cursor-pointer text-center appearance-none truncate transition-all duration-300
                                                    ${cat.brand
                                                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                                                        : 'bg-gray-50 dark:bg-white/5 text-slate-400 border-slate-300 dark:border-white/20 shadow-inner'
                                                    }
                                            focus:border-blue-500/50`}
                                            >
                                                <option value="">{t('cashback_detailed.select_brand')}</option>
                                                {BRANDS_DATA
                                                    .filter(brand => {
                                                        const baseId = cat.id.replace(/_\d+$/, '');
                                                        return brand.categories && brand.categories.includes(baseId);
                                                    })
                                                    .map(brand => (
                                                        <option key={brand.name} value={brand.name}>{brand.name}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>

                                        {/* Percentage Input */}
                                        <div className="col-span-3 sm:flex-[1] relative">
                                            {cat.fixedAmount !== undefined ? (
                                                <div className="w-full py-4 text-right font-black text-base text-blue-500 flex items-center justify-end px-2">
                                                    €{cat.fixedAmount.toFixed(0)}
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={cat.percentage || ''}
                                                        onChange={(e) => handleUpdate(cat.id, 'percentage', parseFloat(e.target.value) || 0)}
                                                        onFocus={(e) => e.target.select()}
                                                        placeholder="0"
                                                        className="w-full pr-8 py-3 bg-transparent text-right font-black text-base text-blue-500 border-b-2 border-blue-500/20 outline-none focus:border-blue-500 transition-colors"
                                                        step="0.1"
                                                    />
                                                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-blue-400 font-bold pointer-events-none">%</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Desktop Result - WOW iOS */}
                                        <div className="hidden sm:block sm:w-36 text-right shrink-0">
                                            <AnimatePresence mode="wait">
                                                <motion.p
                                                    key={`res-${cat.id}-${cat.percentage}-${cat.amount}`}
                                                    className={`font-black text-4xl tracking-tighter transition-colors duration-300 ${cat.amount > 0 && cat.percentage > 0 ? 'text-blue-500 drop-shadow-sm animate-pulse' : 'text-slate-200 dark:text-slate-800'}`}
                                                    initial={{ scale: 0.9, opacity: 0.5 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                >
                                                    €{cat.fixedAmount !== undefined ? (cat.brand ? cat.fixedAmount.toFixed(0) : '0') : (cat.amount * cat.percentage / 100).toLocaleString(lang, { maximumFractionDigits: 0 })}
                                                </motion.p>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 sm:px-12 sm:py-10 border-t border-gray-100/50 dark:border-white/5 bg-white/40 dark:bg-gray-900/40 backdrop-blur-3xl z-10 safe-area-bottom flex flex-row items-center gap-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)]">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-3 px-6 py-4 bg-red-500 text-white rounded-full transition-all shadow-lg shadow-red-500/30 hover:bg-red-600 hover:scale-105 active:scale-95 font-black border border-red-400 group"
                    >
                        <RotateCcw size={20} className="group-hover:-rotate-180 transition-transform duration-500" />
                        <span className="text-[10px] uppercase tracking-widest">{t('cashback_detailed.reset')}</span>
                    </button>

                    <button
                        onClick={() => onConfirm(totalSpend, totalCashback, categories)}
                        className="flex-1 bg-blue-500 text-white font-black py-4 sm:py-6 rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all text-lg sm:text-2xl uppercase tracking-[0.2em] flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                        {/* Apple-style shine */}
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {t('cashback_detailed.confirm')}
                        <Check size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div >

            <CashbackFocusMode
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
                onSelect={handleFocusModeSelect}
                t={t}
                language={language}
            />
        </div >
    );
};
