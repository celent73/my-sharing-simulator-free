import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface NebulaCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    tiltIntensity?: number;
}

const NebulaCard: React.FC<NebulaCardProps> = ({ 
    children, 
    className = "", 
    glowColor = "rgba(124, 58, 237, 0.5)", 
    tiltIntensity = 10 
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Mouse positions for tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smoothing the tilt effect
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Transform mouse position to rotation degrees
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`relative group ${className}`}
        >
            {/* Holographic Glow Border */}
            <div 
                className="absolute -inset-[1px] rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px]"
                style={{
                    background: `linear-gradient(135deg, ${glowColor}, transparent, ${glowColor})`,
                    zIndex: -1
                }}
            />

            {/* Main Glass Container */}
            <div 
                className="relative h-full w-full bg-white/5 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl transition-all duration-500"
                style={{
                    transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
                }}
            >
                {/* Dynamic Inner Glow */}
                <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), ${glowColor}55 0%, transparent 70%)`
                    }}
                />
                
                {children}
            </div>
        </motion.div>
    );
};

export default NebulaCard;
