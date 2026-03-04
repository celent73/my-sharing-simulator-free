import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
    onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animation duration logic
        const timer = setTimeout(() => {
            onComplete();
        }, 3500);

        const interval = setInterval(() => {
            setProgress(prev => (prev < 100 ? prev + 1.5 : 100));
        }, 30);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100000] bg-[#050510] flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Logo Container */}
            <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.2
                }}
                className="relative z-10 mb-12"
            >
                {/* Outer Glow Ring */}
                <motion.div
                    className="absolute inset-[-30px] border-2 border-blue-500/30 rounded-[3.5rem]"
                    animate={{
                        rotate: 360,
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                        default: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                />

                {/* Inner Glow Ring */}
                <motion.div
                    className="absolute inset-[-15px] border border-orange-500/20 rounded-[3rem]"
                    animate={{
                        rotate: -360,
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        default: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                />

                <div className="w-40 h-40 md:w-56 md:h-56 bg-white/5 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center border border-white/10 shadow-[0_0_80px_rgba(0,119,200,0.2)] p-8">
                    <img src="/logo_new.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
            </motion.div>

            {/* App Name */}
            <div className="text-center relative z-10 px-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-2 filter drop-shadow-lg">
                        MY <span className="text-blue-500">SHARING</span> <span className="text-orange-500">SIMULATOR</span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent self-center"></div>
                    <p className="text-slate-400 font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase">
                        Experience the Future of Sharing
                    </p>
                </motion.div>
            </div>

            {/* Modern Progress Indicator */}
            <div className="absolute bottom-24 w-64 flex flex-col items-center gap-3">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 bg-[length:200%_100%]"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${progress}%`,
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                        }}
                        transition={{
                            width: { duration: 0.1 },
                            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                        }}
                    />
                </div>
                <div className="flex justify-between w-full text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Inizializzazione</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Footer Text */}
            <motion.div
                className="absolute bottom-10 text-[9px] font-bold text-slate-600 dark:text-slate-700 tracking-widest uppercase opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 2 }}
            >
                © 2026 My Sharing Simulator • v1.2.60
            </motion.div>
        </motion.div>
    );
};

export default SplashScreen;
