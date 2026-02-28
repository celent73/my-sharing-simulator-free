import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FirstVisitModalProps {
    onComplete?: () => void;
    forceInstall?: boolean; // NEW PROP: If true, blocks access until installed
}

const FirstVisitModal: React.FC<FirstVisitModalProps> = ({ onComplete, forceInstall = false }) => {
    const { t, setLanguage, language } = useLanguage();
    const [showGuide, setShowGuide] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));
        setIsAndroid(/android/.test(userAgent));
    }, []);

    const handleLanguageSelect = (lang: 'it' | 'de') => {
        setLanguage(lang);
        setShowGuide(true);
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900 animate-in fade-in duration-500">
            {/* STEP 1: Language Selection */}
            {!showGuide ? (
                <div className="text-center p-6 max-w-md w-full animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-union-blue-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(0,119,200,0.5)]">
                        <img src="/logo_new.png" alt="Logo" className="w-16 h-16 object-contain" />
                    </div>

                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                        Simulatore <span className="text-union-orange-500">Sharing</span>
                    </h1>
                    <p className="text-blue-200 mb-10 text-lg font-medium">{t('welcome.subtitle')}</p>

                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={() => handleLanguageSelect('it')}
                            className="group relative bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-3xl transition-all hover:scale-105"
                        >
                            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🇮🇹</div>
                            <span className="font-bold text-white text-xl">Italiano</span>
                        </button>

                        <button
                            onClick={() => handleLanguageSelect('de')}
                            className="group relative bg-white/10 hover:bg-white/20 border border-white/20 p-6 rounded-3xl transition-all hover:scale-105"
                        >
                            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">🇩🇪</div>
                            <span className="font-bold text-white text-xl">Deutsch</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* STEP 2: Installation Guide */
                <div className="bg-white dark:bg-slate-800 w-full h-full sm:h-auto sm:max-w-lg sm:rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden animate-in slide-in-from-right duration-500">
                    {/* Background shapes */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-union-blue-500 to-union-orange-500"></div>
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-union-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="mb-6 text-center relative z-10">
                        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg animate-pulse ${forceInstall ? 'bg-red-100 text-red-500' : 'bg-union-blue-50 text-union-blue-600'}`}>
                            {forceInstall ? '🚀' : '📲'}
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                            {forceInstall ? t('welcome.install_required_title') : t('welcome.install_title')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed max-w-xs mx-auto">
                            {forceInstall ? t('welcome.install_required_desc') : t('welcome.install_desc')}
                        </p>
                    </div>

                    {/* Device Specific Instructions */}
                    <div className="w-full bg-gray-50 dark:bg-slate-700/50 rounded-2xl p-6 border border-gray-100 dark:border-slate-600 mb-6 relative z-10 shadow-inner">
                        {isIOS ? (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl text-blue-500 bg-blue-100 rounded-lg p-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 1</span>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{t('welcome.ios_step1')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl bg-gray-200 rounded-lg p-2">➕</div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 2</span>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{t('welcome.ios_step2')}</p>
                                    </div>
                                </div>
                            </div>
                        ) : isAndroid ? (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg p-2">⋮</div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 1</span>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{t('welcome.android_step1')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl bg-gray-200 rounded-lg p-2">⬇️</div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step 2</span>
                                        <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{t('welcome.android_step2')}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="text-3xl bg-gray-100 p-3 rounded-xl">💻</div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('welcome.pc_text')}</p>
                            </div>
                        )}
                    </div>

                    {/* WAIT NOTICE REMOVED */}

                    {!forceInstall && onComplete && (
                        <button
                            onClick={onComplete}
                            className="w-full bg-union-blue-600 hover:bg-union-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            {t('welcome.start_btn')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FirstVisitModal;