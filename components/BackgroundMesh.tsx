import React, { useEffect, useRef } from 'react';

const BackgroundMesh = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        let animationFrameId: number;

        // Configuration
        const particleCount = 60; // Numero di nodi
        const connectionDistance = 150; // Distanza massima per tracciare una linea
        let mouseX = -1000;
        let mouseY = -1000;

        // Resize handler
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;

            constructor(width: number, height: number) {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Velocità X
                this.vy = (Math.random() - 0.5) * 0.5; // Velocità Y
                this.size = Math.random() * 2 + 0.5;
            }

            update(width: number, height: number) {
                this.x += this.vx;
                this.y += this.vy;

                // Rimbalzo sui bordi
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Colore nodi
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);

                        // Opacità basata sulla distanza
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`; // Colore linee base
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Connessione ai movimenti del mouse
                const mouseDx = particles[i].x - mouseX;
                const mouseDy = particles[i].y - mouseY;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                if (mouseDistance < 200) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouseX, mouseY);
                    const mouseOpacity = 1 - (mouseDistance / 200);
                    // Colore interazione mouse (Cyan/Blue tint)
                    ctx.strokeStyle = `rgba(56, 189, 248, ${mouseOpacity * 0.3})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // Attrazione magnetica leggera
                    particles[i].x -= mouseDx * 0.005;
                    particles[i].y -= mouseDy * 0.005;
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulisce il frame

            particles.forEach(particle => {
                particle.update(canvas.width, canvas.height);
                particle.draw(ctx);
            });

            drawConnections();

            animationFrameId = requestAnimationFrame(animate);
        };

        // Event listeners
        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseLeave = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Inizializzazione
        resizeCanvas();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block bg-slate-950">
            {/* NEBULA GRADIENTS - Deep Premium Colors */}
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/10 blur-[120px] animate-[pulse_10s_ease-in-out_infinite]" />
            <div className="absolute top-[30%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[140px] animate-[pulse_12s_ease-in-out_infinite] delay-1000" />
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[130px] animate-[pulse_14s_ease-in-out_infinite] delay-2000" />

            {/* NEURAL NETWORK CANVAS LAYER */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-60"
            />

            {/* NOISE TEXTURE OVERLAY - Subtle grain texturing */}
            <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* VIGNETTE EFFECT - Darkens borders */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
        </div>
    );
};

export default BackgroundMesh;
