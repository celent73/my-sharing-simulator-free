import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface CareerDeadlineAlertModalProps {
    isOpen: boolean;
    stageName: string;
    onAchieved: () => void;
    onPostpone: () => void;
    onClose: () => void;
}

const CareerDeadlineAlertModal: React.FC<CareerDeadlineAlertModalProps> = ({
    isOpen,
    stageName,
    onAchieved,
    onPostpone,
    onClose
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Background Animated Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                                initial={{ 
                                    x: Math.random() * window.innerWidth, 
                                    y: Math.random() * window.innerHeight,
                                    opacity: 0,
                                    scale: 0
                                }}
                                animate={{ 
                                    y: [null, -100, -200],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0]
                                }}
                                transition={{ 
                                    duration: Math.random() * 2 + 2, 
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="relative w-full max-w-md bg-slate-900 rounded-[3rem] border-4 border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.5)] overflow-hidden"
                        initial={{ scale: 0.8, y: 50, opacity: 0, rotate: -5 }}
                        animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.8, y: 50, opacity: 0, rotate: 5 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    >
                        {/* Flashing Top Border */}
                        <motion.div 
                            className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        />

                        <div className="p-8 pb-10 text-center relative z-10">
                            {/* Animated Icon Container */}
                            <motion.div 
                                className="w-24 h-24 mx-auto mb-8 relative"
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-3xl blur-[15px] opacity-60 animate-pulse" />
                                <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-700 rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                                    <Trophy className="w-12 h-12 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                </div>
                                <motion.div 
                                    className="absolute -top-4 -right-4"
                                    animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                >
                                    <Sparkles className="w-8 h-8 text-yellow-400" />
                                </motion.div>
                            </motion.div>

                            <motion.h2 
                                className="text-4xl font-black text-white mb-4 tracking-tight leading-none"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1 }}
                            >
                                È IL GRANDE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">GIORNO!</span>
                            </motion.h2>

                            <div className="inline-block px-4 py-2 rounded-2xl bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
                                <p className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Traguardo Scaduto</p>
                                <h3 className="text-2xl font-black text-white mt-1" style={{ color: '#ec4899' }}>{stageName}</h3>
                            </div>

                            <p className="text-lg font-bold text-slate-300 mb-10 leading-relaxed px-4">
                                Scoccata l'ora della verità!<br/>
                                <span className="text-white">Hai ufficialmente raggiunto questa qualifica?</span>
                            </p>

                            <div className="grid gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16,185,129,0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onAchieved}
                                    className="w-full py-5 rounded-2xl bg-emerald-500 text-white font-black text-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 border-b-4 border-emerald-700"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    SÌ, CE L'HO FATTA! 🏆
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onPostpone}
                                    className="w-full py-4 rounded-2xl bg-white/10 text-white font-black text-lg border-2 border-white/10 flex items-center justify-center gap-3"
                                >
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                    NON ANCORA, SPOSTA 📅
                                </motion.button>

                                <button 
                                    onClick={onClose}
                                    className="mt-2 text-slate-500 hover:text-slate-300 font-bold text-sm uppercase tracking-widest transition-colors"
                                >
                                    Magari più tardi
                                </button>
                            </div>
                        </div>

                        {/* Animated background stripes */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none z-0 overflow-hidden">
                            <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,white_20px,white_40px)] rotate-[15deg]"></div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CareerDeadlineAlertModal;
