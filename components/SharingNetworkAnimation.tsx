import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const SharingNetworkAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            if (canvasRef.current) {
                const parent = canvasRef.current.parentElement || document.body;
                const { clientWidth, clientHeight } = parent;
                setDimensions({ width: clientWidth, height: clientHeight });
                canvasRef.current.width = clientWidth;
                canvasRef.current.height = clientHeight;
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let nodes: Node[] = [];
        let particles: Particle[] = [];

        // Detect Desktop for scaling
        const isDesktop = window.innerWidth > 1024;

        const maxNodes = isDesktop ? 60 : 40; // Reduced for simplicity
        const connectionDistance = isDesktop ? 220 : 180;
        const spawnInterval = isDesktop ? 12 : 20; // Slower spawn

        const logoImg = new Image();
        logoImg.src = '/logo_new.png';

        class Node {
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            type: 'center' | 'avatar_m' | 'avatar_f';
            pulse: number;
            pulseDir: number;

            constructor(x: number, y: number, type: 'center' | 'avatar_m' | 'avatar_f') {
                this.x = x;
                this.y = y;
                this.type = type;

                if (type === 'center') {
                    this.vx = 0;
                    this.vy = 0;
                    this.radius = isDesktop ? 60 : 45;
                } else {
                    const angle = Math.random() * Math.PI * 2;
                    // Balanced speed for fluidity
                    const speed = (Math.random() * 0.4 + 0.3);
                    this.vx = Math.cos(angle) * speed;
                    this.vy = Math.sin(angle) * speed;
                    this.radius = Math.random() * 6 + 4;
                }

                this.pulse = 0;
                this.pulseDir = 0.02;
            }

            update() {
                if (this.type !== 'center') {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
                }

                this.pulse += this.pulseDir;
                if (this.pulse > 1 || this.pulse < 0) this.pulseDir *= -1;
            }

            draw() {
                if (!ctx) return;

                // Glow - softer alpha
                const alpha = this.type === 'center' ? 0.6 : 0.3;
                const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, this.radius * 2.5);
                gradient.addColorStop(0, `rgba(0, 194, 255, ${alpha})`);
                gradient.addColorStop(1, 'rgba(0, 194, 255, 0)');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Core Shape
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.type === 'center' ? '#fff' : '#00C2FF';
                ctx.fill();

                if (this.type === 'center' && logoImg.complete) {
                    const size = this.radius * 1.6;
                    ctx.drawImage(logoImg, this.x - size / 2, this.y - size / 2, size, size);
                } else if (this.type !== 'center') {
                    ctx.fillStyle = '#111';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(this.x, this.y + this.radius * 0.5, this.radius * 0.5, Math.PI, 0);
                    ctx.fill();
                }
            }
        }

        class Particle {
            startNode: Node;
            endNode: Node;
            progress: number;
            speed: number;
            color: string;
            trail: { x: number, y: number }[];

            constructor(start: Node, end: Node) {
                this.startNode = start;
                this.endNode = end;
                this.progress = 0;
                this.speed = (Math.random() * 0.02 + 0.01);
                this.color = Math.random() > 0.5 ? '#00C2FF' : '#FF6600';
                this.trail = [];
            }

            update() {
                this.progress += this.speed;
                const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
                const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
                this.trail.push({ x, y });
                if (this.trail.length > 8) this.trail.shift();
            }

            draw() {
                if (!ctx) return;

                if (this.trail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.trail[0].x, this.trail[0].y);
                    for (let i = 1; i < this.trail.length; i++) {
                        ctx.lineTo(this.trail[i].x, this.trail[i].y);
                    }
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                if (this.trail.length > 0) {
                    const head = this.trail[this.trail.length - 1];
                    ctx.beginPath();
                    ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                }
            }
        }

        const centerNode = new Node(canvas.width / 2, canvas.height / 2, 'center');
        nodes.push(centerNode);

        const spawnNode = () => {
            if (nodes.length < maxNodes) {
                const type = Math.random() > 0.5 ? 'avatar_m' : 'avatar_f';
                nodes.push(new Node(canvas.width / 2, canvas.height / 2, type));
            }
        };

        let frameCount = 0;

        const render = () => {
            frameCount++;

            if (frameCount % spawnInterval === 0) spawnNode();

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            nodes.forEach(node => {
                node.update();
            });

            nodes[0].x = canvas.width / 2;
            nodes[0].y = canvas.height / 2;

            ctx.globalCompositeOperation = 'lighter';

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = 1 - dist / connectionDistance;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 194, 255, ${alpha * 0.3})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();

                        if (Math.random() < 0.002) {
                            particles.push(new Particle(nodes[i], nodes[j]));
                        }
                    }
                }
            }

            nodes.forEach(node => node.draw());

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].progress >= 1) {
                    particles.splice(i, 1);
                }
            }

            ctx.globalCompositeOperation = 'source-over';
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions]);

    return (
        <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex flex-col items-center justify-start pt-20">
            <canvas ref={canvasRef} className="absolute inset-0 z-0" />

            <motion.div
                className="relative z-10 text-center pointer-events-none mt-10 md:mt-20"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter flex flex-wrap justify-center gap-x-4">
                    <span
                        className="text-union-blue-500 drop-shadow-[0_0_30px_rgba(0,119,200,0.8)]"
                    >
                        Sharing
                    </span>
                    <span
                        className="text-union-orange-500 drop-shadow-[0_0_30px_rgba(249,115,22,0.8)]"
                    >
                        Simulator
                    </span>
                </h1>
            </motion.div>
        </div>
    );
};
