import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';

// Types for our nodes
interface NetworkNode {
    id: string;
    x: number;
    y: number;
    level: 0 | 1 | 2 | 3;
    parent?: string;
    color: string;
    delay: number;
    scale?: number;
}

export const RevolutionNetworkAnimation: React.FC = () => {
    const [nodes, setNodes] = useState<NetworkNode[]>([]);
    const [lines, setLines] = useState<{ from: NetworkNode; to: NetworkNode; id: string }[]>([]);

    useEffect(() => {
        const centerX = 50;
        const centerY = 50;
        const newNodes: NetworkNode[] = [];
        const newLines: { from: NetworkNode; to: NetworkNode; id: string }[] = [];

        // Level 0: Central Node
        const centerNode: NetworkNode = {
            id: 'root',
            x: centerX,
            y: centerY,
            level: 0,
            color: 'bg-white',
            delay: 0
        };
        newNodes.push(centerNode);

        // Helper for balanced random
        const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

        // VIBRANT Colors for Light Mode (Slightly darker for visibility on white/light bg)
        // Using 600 shades for better contrast against white, but keeping 500 for vibrant look
        const level1Colors = ['bg-orange-500', 'bg-purple-600', 'bg-emerald-500', 'bg-cyan-500', 'bg-blue-600'];

        const addNodes = (
            parent: NetworkNode,
            count: number,
            level: 1 | 2 | 3,
            radius: number,
            startAngle: number,
            angleSpread: number,
            baseDelay: number
        ) => {
            const angleStep = angleSpread / count;

            for (let i = 0; i < count; i++) {
                const angleVariance = randomRange(-10, 10) * (Math.PI / 180);
                const baseAngleRad = (startAngle + i * angleStep) * (Math.PI / 180);
                const angle = baseAngleRad + angleVariance;

                let nodeX = 0;
                let nodeY = 0;

                if (level === 1) {
                    nodeX = centerX + radius * Math.cos(angle);
                    nodeY = centerY + radius * Math.sin(angle);
                } else {
                    const angleFromCenter = Math.atan2(parent.y - centerY, parent.x - centerX);
                    const spreadRad = 60 * (Math.PI / 180);
                    const childOffset = (i - (count - 1) / 2) * (spreadRad / (count || 1));
                    const finalAngle = angleFromCenter + childOffset + randomRange(-0.2, 0.2);

                    const dist = radius * randomRange(0.8, 1.2);
                    nodeX = parent.x + dist * Math.cos(finalAngle);
                    nodeY = parent.y + dist * Math.sin(finalAngle);
                }

                let nodeColor = 'bg-blue-500';
                if (level === 1) nodeColor = level1Colors[i % level1Colors.length];
                if (level === 2) nodeColor = parent.color;
                if (level === 3) nodeColor = 'bg-blue-500';

                const newNode: NetworkNode = {
                    id: `${level}-${parent.id}-${i}`,
                    x: nodeX,
                    y: nodeY,
                    level: level,
                    parent: parent.id,
                    color: nodeColor,
                    delay: baseDelay + i * 0.15,
                    scale: level === 1 ? 1.2 : (level === 2 ? 1 : 0.8)
                };

                newNodes.push(newNode);
                newLines.push({ from: parent, to: newNode, id: `line-${parent.id}-${newNode.id}` });

                if (level === 1) {
                    addNodes(newNode, Math.floor(randomRange(2, 3)), 2, 10, 0, 0, baseDelay + 0.6);
                } else if (level === 2) {
                    if (Math.random() > 0.4) {
                        addNodes(newNode, Math.floor(randomRange(1, 2)), 3, 8, 0, 0, baseDelay + 0.6);
                    }
                }
            }
        };

        addNodes(centerNode, 6, 1, 18, -90, 360, 0.2);

        setNodes(newNodes);
        setLines(newLines);

    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Transparent background for embedding in light modal */}

            {/* Ambient Background Glow for depth - subtly colored */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* SVG Layer for Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                    <linearGradient id="lineGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(100, 116, 139, 0.1)" />
                        <stop offset="50%" stopColor="rgba(100, 116, 139, 0.4)" /> {/* Darker for visibility on white */}
                        <stop offset="100%" stopColor="rgba(100, 116, 139, 0.1)" />
                    </linearGradient>
                </defs>
                {lines.map((line) => (
                    <Line key={line.id} from={line.from} to={line.to} delay={line.to.delay} />
                ))}
            </svg>

            {/* Nodes Layer */}
            <div className="absolute inset-0 w-full h-full z-10">
                {nodes.map((node) => (
                    <Node key={node.id} node={node} />
                ))}
            </div>
        </div>
    );
};

const Line = ({ from, to, delay }: { from: NetworkNode; to: NetworkNode; delay: number }) => {
    return (
        <motion.line
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="url(#lineGradientLight)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: delay, ease: "easeOut" }}
        />
    );
};

const Node = ({ node }: { node: NetworkNode }) => {
    const isCenter = node.level === 0;

    return (
        <motion.div
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full ${isCenter ? 'z-20' : 'z-10'}`}
            style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                width: isCenter ? '140px' : '65px',
                height: isCenter ? '140px' : '65px',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
                scale: [0, node.scale || 1],
                opacity: 1,
                y: [0, -5, 0]
            }}
            transition={{
                scale: { type: "spring", stiffness: 200, damping: 15, delay: node.delay },
                opacity: { duration: 0.5, delay: node.delay },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: node.delay + Math.random() }
            }}
        >
            {isCenter ? (
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Pulsing Glow - Adjusted for Light Mode */}
                    <motion.div
                        className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-blue-500 shadow-xl overflow-hidden z-20">
                        <img src="/logo_new.png" alt="Union" className="w-[85%] object-contain" />
                    </div>
                </div>
            ) : (
                <div className={`
                    w-full h-full rounded-full ${node.color} 
                    border-2 border-white 
                    flex items-center justify-center 
                    shadow-lg shadow-black/10
                    group
                `}>
                    <User className="text-white w-1/2 h-1/2" />
                </div>
            )}
        </motion.div>
    );
};
