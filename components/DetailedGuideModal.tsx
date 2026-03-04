import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useShary } from '../contexts/SharyContext';

interface DetailedGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DetailedGuideModal: React.FC<DetailedGuideModalProps> = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    const { isActive: isSharyActive, toggleShary } = useShary();
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [confetti, setConfetti] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const tabs = [
        { id: 'intro', icon: '👋', title: t('guide_wow.tabs.intro'), color: 'from-blue-500 to-indigo-600' },
        { id: 'network', icon: '👥', title: t('guide_wow.tabs.network'), color: 'from-purple-500 to-pink-600' },
        { id: 'bonus', icon: '💎', title: t('guide_wow.tabs.bonus'), color: 'from-emerald-400 to-teal-600' },
        { id: 'vision', icon: '✨', title: t('guide_wow.tabs.vision'), color: 'from-amber-400 to-orange-600' },
        { id: 'admin', icon: '🏢', title: t('guide_wow.tabs.admin'), color: 'from-slate-700 to-slate-900' },
    ];

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setConfetti(false);
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < tabs.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setIsAnimating(false);
            }, 300);
        } else {
            // Finish
            setConfetti(true);
            setTimeout(onClose, 2500);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(prev => prev - 1);
                setIsAnimating(false);
            }, 300);
        }
    };

    const handleDownloadPDF = async () => {
        if (printRef.current) {
            try {
                // Ensure fonts are ready
                await document.fonts.ready;

                const dataUrl = await toPng(printRef.current, { quality: 0.95, pixelRatio: 2 });
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(dataUrl);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Simulatore_Sharing_Guida.pdf');
            } catch (err) {
                console.error('Failed to generate PDF', err);
            }
        }
    };

    if (!isOpen) return null;

    const activeTab = tabs[currentStep];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Dynamic Background with Blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-all duration-700 animate-in fade-in"
                onClick={onClose}
            />

            {/* Confetti Effect (Simple CSS Implementation) */}
            {confetti && (
                <div className="absolute inset-0 z-[110] pointer-events-none overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="absolute animate-confetti" style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10px`,
                            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'][Math.floor(Math.random() * 5)],
                            width: '10px',
                            height: '10px',
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${1 + Math.random() * 2}s`
                        }} />
                    ))}
                </div>
            )}

            {/* Main Card */}
            <div className="relative z-[101] w-full max-w-5xl h-[85vh] bg-white dark:bg-black/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 ease-out">

                {/* Header / Progress */}
                <div className="shrink-0 p-8 pb-4 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${activeTab.color} opacity-20`} />
                    <div
                        className={`absolute top-0 left-0 h-2 bg-gradient-to-r ${activeTab.color} transition-all duration-700 ease-out`}
                        style={{ width: `${((currentStep + 1) / tabs.length) * 100}%` }}
                    />

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight flex items-center gap-3">
                                <span className="animate-bounce-slow text-4xl">{activeTab.icon}</span>
                                {activeTab.title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium mt-2 text-lg">
                                {t('guide_wow.subtitle')} &bull; Step {currentStep + 1} di {tabs.length}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDownloadPDF}
                                className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold transition-all border border-transparent dark:hover:border-blue-500/30 flex items-center gap-2"
                                title="Scarica PDF"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                <span className="hidden sm:inline text-sm">PDF</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-red-500/20 text-gray-400 hover:text-gray-600 dark:hover:text-red-400 transition-all border border-transparent dark:hover:border-red-500/30"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Tabs Indicator (Pills) */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {tabs.map((tab, idx) => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentStep(idx)}
                                className={`
                                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border
                                ${currentStep === idx
                                        ? `bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg scale-105`
                                        : 'bg-transparent text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                    }
                            `}
                            >
                                <span>{tab.icon}</span>
                                <span className={currentStep === idx ? 'block' : 'hidden sm:block'}>{tab.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
                    <div className={`transition-all duration-300 ease-in-out transform ${isAnimating ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`}>

                        {/* INTRO */}
                        {activeTab.id === 'intro' && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-md">
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        {t('guide_wow.content.intro_title')}
                                    </h3>
                                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                                        {t('guide_wow.content.intro_text')}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-400/30 transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">🎛️</div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Input Panel</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Gioca con i cursori e scopri il potenziale della tua rendita.</p>
                                    </div>
                                    <div className="group p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all hover:shadow-xl hover:-translate-y-1">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">📈</div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Grafici Live</h4>
                                        <p className="text-gray-500 dark:text-gray-400">Visualizza la crescita nel tempo con proiezioni a 3 anni.</p>
                                    </div>
                                </div>



                                {/* Shary Toggle Section */}
                                <div className="mt-8 p-6 bg-cyan-50 dark:bg-cyan-900/10 rounded-3xl border border-cyan-100 dark:border-cyan-500/20 flex flex-col md:flex-row items-center cursor-pointer hover:bg-cyan-100 dark:hover:bg-cyan-900/20 transition-all" onClick={toggleShary}>
                                    <div className="flex-1 mb-4 md:mb-0">
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                            <span>🤖</span>
                                            {language === 'de' ? 'Aktiviere Shary, deinen KI-Assistenten' : 'Attiva Shary, il tuo Assistente AI'}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                                            {language === 'de'
                                                ? 'Shary hilft dir bei jedem Schritt mit Sprachanweisungen. Klicke hier, um ihn zu aktivieren!'
                                                : 'Shary ti aiuterà passo dopo passo con suggerimenti vocali. Clicca qui per attivarlo!'}
                                        </p>
                                    </div>
                                    <div className={`w-16 h-9 rounded-full relative transition-colors duration-300 ${isSharyActive ? 'bg-cyan-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                        <div className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transition-transform duration-300 transform ${isSharyActive ? 'translate-x-7' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NETWORK */}
                        {activeTab.id === 'network' && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                            {t('guide_wow.content.network_title')} <span className="text-purple-500">Exponential Growth</span>
                                        </h3>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                            {t('guide_wow.content.network_desc')}
                                        </p>
                                    </div>
                                    <div className="w-full md:w-1/3 bg-purple-100 dark:bg-purple-900/20 rounded-3xl p-6 flex items-center justify-center">
                                        <div className="text-9xl animate-pulse">🚀</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { num: '1', color: 'bg-blue-500', text: t('guide_wow.content.network_p1') },
                                        { num: '2', color: 'bg-purple-500', text: t('guide_wow.content.network_p2') },
                                        { num: '3', color: 'bg-pink-500', text: t('guide_wow.content.network_p3') },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-6 items-center p-6 bg-white dark:bg-white/5 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 transition-all">
                                            <div className={`w-12 h-12 shrink-0 ${item.color} rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-500/20`}>
                                                {item.num}
                                            </div>
                                            <div className="text-base text-gray-700 dark:text-gray-200 font-medium" dangerouslySetInnerHTML={{ __html: item.text }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* BONUS */}
                        {activeTab.id === 'bonus' && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-2xl shadow-emerald-500/30 transform hover:scale-[1.01] transition-transform">
                                    <h3 className="text-4xl font-black mb-4">{t('guide_wow.content.bonus_title')}</h3>
                                    <p className="text-xl text-emerald-50 opacity-90 font-medium">{t('guide_wow.content.bonus_desc')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-fuchsia-900/10 dark:to-pink-900/10 border border-fuchsia-100 dark:border-fuchsia-500/20 hover:shadow-xl transition-all">
                                        <div className="text-4xl mb-4">🛍️</div>
                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Cashback</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.bonus_p1') }} />
                                    </div>
                                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border border-teal-100 dark:border-teal-500/20 hover:shadow-xl transition-all">
                                        <div className="text-4xl mb-4">💼</div>
                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Clienti Personali</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.bonus_p2') }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* VISION */}
                        {activeTab.id === 'vision' && (
                            <div className="space-y-8 max-w-4xl mx-auto text-center">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                                    {t('guide_wow.content.vision_title')}
                                </h3>
                                <p className="text-xl text-gray-500 dark:text-gray-400 italic mb-8 max-w-2xl mx-auto">"{t('guide_wow.content.vision_desc')}"</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {[
                                        { icon: '🧾', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-200 dark:border-emerald-800', text: t('guide_wow.content.vision_zero') },
                                        { icon: '🦅', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-200 dark:border-blue-800', text: t('guide_wow.content.vision_freedom') },
                                        { icon: '🌠', bg: 'bg-rose-50 dark:bg-rose-900/10', border: 'border-rose-200 dark:border-rose-800', text: t('guide_wow.content.vision_dreams') },
                                        { icon: '🛡️', bg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-gray-200 dark:border-gray-700', text: t('guide_wow.content.vision_pension') },
                                    ].map((card, i) => (
                                        <div key={i} className={`p-6 rounded-3xl ${card.bg} border ${card.border} text-left transition-transform hover:scale-105`}>
                                            <span className="text-4xl block mb-3">{card.icon}</span>
                                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-snug" dangerouslySetInnerHTML={{ __html: card.text }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ADMIN */}
                        {activeTab.id === 'admin' && (
                            <div className="space-y-8 max-w-4xl mx-auto">
                                <div className="bg-slate-900 dark:bg-black p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <h3 className="text-3xl font-bold text-white mb-4 relative z-10">🏢 {t('guide_wow.content.admin_title')}</h3>
                                    <p className="text-gray-400 text-lg relative z-10">{t('guide_wow.content.admin_desc')}</p>
                                </div>

                                <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 shadow-lg">
                                    <ul className="space-y-6">
                                        <li className="flex gap-4 items-start">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold">1</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-lg" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.admin_p1') }} />
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center font-bold">2</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-lg" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.admin_p2') }} />
                                        </li>
                                        <li className="flex gap-4 items-start">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 flex items-center justify-center font-bold">★</span>
                                            <span className="text-gray-700 dark:text-gray-300 text-lg font-medium" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.admin_p3') }} />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Print View Hidden - Changed to absolute for better capture reliability */}
                <div
                    ref={printRef}
                    className="absolute top-0 left-0 w-[794px] min-h-[1123px] bg-white text-gray-900 z-[-1000] p-10 transform translate-x-[-9999px]"
                >
                    <div className="space-y-10">
                        <div className="text-center border-b pb-8">
                            <h1 className="text-4xl font-black mb-2">{t('guide_wow.title')}</h1>
                            <p className="text-xl text-gray-500">{t('guide_wow.subtitle')}</p>
                        </div>

                        {/* Intro */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-blue-500 pl-4">{t('guide_wow.tabs.intro')}</h2>
                            <p className="text-base leading-relaxed">{t('guide_wow.content.intro_text')}</p>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200"><h4 className="font-bold">Input Panel</h4><p className="text-xs">Imposta i cursori.</p></div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200"><h4 className="font-bold">Grafici Live</h4><p className="text-xs">Visualizza la crescita.</p></div>
                            </div>
                        </div>

                        {/* Network */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-purple-500 pl-4">{t('guide_wow.tabs.network')}</h2>
                            <p className="text-base leading-relaxed">{t('guide_wow.content.network_desc')}</p>
                            <div className="space-y-2">
                                <p><strong>1.</strong> <span dangerouslySetInnerHTML={{ __html: t('guide_wow.content.network_p1') }} /></p>
                                <p><strong>2.</strong> <span dangerouslySetInnerHTML={{ __html: t('guide_wow.content.network_p2') }} /></p>
                                <p><strong>3.</strong> <span dangerouslySetInnerHTML={{ __html: t('guide_wow.content.network_p3') }} /></p>
                            </div>
                        </div>

                        {/* Bonus */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-emerald-500 pl-4">{t('guide_wow.tabs.bonus')}</h2>
                            <p className="text-base leading-relaxed">{t('guide_wow.content.bonus_desc')}</p>
                            <div className="space-y-2">
                                <p><strong>Cashback:</strong> <span dangerouslySetInnerHTML={{ __html: t('guide_wow.content.bonus_p1') }} /></p>
                                <p><strong>Clienti Personali:</strong> <span dangerouslySetInnerHTML={{ __html: t('guide_wow.content.bonus_p2') }} /></p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-orange-500 pl-4">{t('guide_wow.tabs.vision')}</h2>
                            <p className="text-base italic">"{t('guide_wow.content.vision_desc')}"</p>
                            <ul className="grid grid-cols-2 gap-4 text-sm mt-4">
                                <li className="p-3 bg-gray-50 border border-gray-200 rounded-lg" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.vision_zero') }} />
                                <li className="p-3 bg-gray-50 border border-gray-200 rounded-lg" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.vision_freedom') }} />
                                <li className="p-3 bg-gray-50 border border-gray-200 rounded-lg" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.vision_dreams') }} />
                                <li className="p-3 bg-gray-50 border border-gray-200 rounded-lg" dangerouslySetInnerHTML={{ __html: t('guide_wow.content.vision_pension') }} />
                            </ul>
                        </div>

                        {/* Admin */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold border-l-4 border-slate-800 pl-4">{t('guide_wow.tabs.admin')}</h2>
                            <p className="text-base leading-relaxed">{t('guide_wow.content.admin_desc')}</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li dangerouslySetInnerHTML={{ __html: t('guide_wow.content.admin_p1') }} />
                                <li dangerouslySetInnerHTML={{ __html: t('guide_wow.content.admin_p2') }} />
                                <li dangerouslySetInnerHTML={{ __html: t('guide_wow.content.admin_p3') }} />
                            </ul>
                        </div>

                        <div className="text-center text-xs text-gray-400 pt-10 border-t">
                            Daily Chek - Guida PDF generate automatically
                        </div>
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="shrink-0 p-6 bg-gray-50/50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5 flex justify-between items-center backdrop-blur-sm">
                    <button
                        onClick={handlePrev}
                        disabled={currentStep === 0}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                    >
                        ← Indietro
                    </button>

                    <div className="flex gap-2">
                        {tabs.map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStep === i ? 'bg-gray-800 dark:bg-white w-6' : 'bg-gray-300 dark:bg-white/20'}`} />
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className={`
                        px-8 py-3 rounded-2xl font-black text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2
                        bg-gradient-to-r ${activeTab.color}
                        shadow-${activeTab.color.split(' ')[0].replace('from-', '')}/30
                    `}
                    >
                        {currentStep === tabs.length - 1 ? 'Inizia Ora 🚀' : 'Avanti →'}
                    </button>
                </div>
            </div >

            <style>{`
            @keyframes confetti {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .animate-confetti {
                animation: confetti 2s linear forwards;
            }
            .no-scrollbar::-webkit-scrollbar {
                display: none;
            }
            .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
        </div >
    );
};

export default DetailedGuideModal;