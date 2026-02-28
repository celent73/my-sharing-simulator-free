import React, { useEffect, useState } from 'react';
import { ExternalLink, Chrome, Smartphone } from 'lucide-react';

export const InAppBrowserOverlay = () => {
    const [isInApp, setIsInApp] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        // Regex per rilevare i principali browser in-app (Facebook, Instagram, LinkedIn, ecc.)
        // FB_IAM = Facebook In-App Browser
        // FBAN/FBAV = Facebook App
        // Instagram = Instagram App
        // LinkedIn = LinkedIn App
        const inAppRegex = /(FB_IAM|FBAN|FBAV|Instagram|LinkedIn|Musical_ly|WhatsApp|Line)/i;

        // Controlla anche se è Android e non è Chrome "vero" (spesso WebView)
        // Nota: è difficile essere perfetti al 100%, ma questo copre i casi più comuni (Meta Apps)
        if (inAppRegex.test(userAgent)) {
            setIsInApp(true);
        }
    }, []);

    if (!isInApp) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Smartphone size={40} className="text-orange-500" />
                </div>

                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                    Apri nel Browser
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Sembra che tu stia aprendo l'app da un social (Facebook, Instagram, WhatsApp...).
                    <br /><br />
                    <strong>Per installare l'app</strong> e usarla correttamente, devi aprirla nel browser di sistema.
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-4 text-left">
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm">
                            <span className="font-bold text-xl">1</span>
                        </div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Tocca i <strong>3 puntini</strong> (menu) in alto a destra
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center gap-4 text-left">
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-lg shadow-sm">
                            <span className="font-bold text-xl">2</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Seleziona <strong>"Apri nel browser"</strong> o <strong>"Apri in Chrome"</strong>
                            </p>
                        </div>
                        <Chrome size={20} className="text-blue-500" />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setIsInApp(false)}
                        className="text-sm text-gray-400 hover:text-gray-600 underline"
                    >
                        Continua comunque (sconsigliato)
                    </button>
                </div>
            </div>
        </div>
    );
};
