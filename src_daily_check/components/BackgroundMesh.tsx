import React from 'react';
import { motion } from 'framer-motion';

const BackgroundMesh: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-950 pointer-events-none">
            {/* Dynamic Stars */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(80)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            opacity: [0.1, 0.6, 0.1],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Nebula Clouds */}
            <motion.div
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, 30, -30, 0],
                    scale: [1, 1.1, 0.9, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -30, 30, 0],
                    y: [0, 60, -60, 0],
                    scale: [1, 1.2, 0.8, 1],
                    rotate: [0, -8, 8, 0]
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-20%] left-[-10%] w-[90%] h-[90%] bg-purple-600/10 rounded-full blur-[140px]"
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 opacity-80"></div>
        </div>
    );
};

export default BackgroundMesh;
