import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import { useHome } from '../hooks/useHome';

export default function LandingPage() {
    const navigate = useNavigate();
    const { createSandbox, isLoadingSandbox, sandboxError } = useHome();
    const [isCreating, setIsCreating] = useState(false);
    const heroRef = useRef(null);

    useEffect(() => {
        // Initialize Lenis for smooth scrolling
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Initial GSAP animation
        const tl = gsap.timeline();
        tl.fromTo(
            ".hero-text",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
        ).fromTo(
            ".hero-button",
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
            "-=0.4"
        );

        return () => {
            lenis.destroy();
        };
    }, []);

    const handleCreateSandbox = async () => {
        setIsCreating(true);
        try {
            const data = await createSandbox({ restoreOnly: false });
            if (data && data.success) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    // Direct mouse-tracking hover handler (super fast, no re-renders)
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div className="relative min-h-[220vh] bg-[#030306] text-white font-sans overflow-hidden">

            {/* Premium Floating Navigation Bar */}
            <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] h-16 bg-[#0c0c14]/65 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-between px-6 z-50 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.02)_inset] transition-all duration-300 hover:border-white/10 select-none">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#4edea3] flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        <span className="material-symbols-outlined text-white text-[16px] animate-[pulse_3s_infinite]" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
                    </div>
                    <span className="font-display font-black text-[15px] uppercase tracking-[0.25em] text-white">FrameForge</span>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-[11.5px] font-code-md text-outline hover:text-white transition-colors tracking-widest uppercase">
                    <a href="#features" className="hover:text-white transition-colors relative group py-2">
                        Features
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#performance" className="hover:text-white transition-colors relative group py-2">
                        Performance
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                    </a>
                    <a href="#docs" className="hover:text-outline-variant transition-colors py-2 opacity-50 cursor-not-allowed">Docs</a>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleCreateSandbox}
                        disabled={isCreating || isLoadingSandbox}
                        className="px-4 py-2 bg-gradient-to-r from-primary-container to-[#6366f1] text-white rounded-xl font-code-md text-[11px] font-bold tracking-widest uppercase hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all active:scale-95 disabled:opacity-50"
                    >
                        Launch Free
                    </button>
                </div>
            </header>

            {/* Dynamic Mesh & Glow Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <motion.div
                    style={{ y }}
                    className="absolute inset-0 opacity-[0.03] bg-noise"
                ></motion.div>

                {/* Animated fluid glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-primary-container/10 blur-[140px] animate-ambient-glow"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-tertiary-container/5 blur-[160px] animate-ambient-glow" style={{ animationDelay: '-5s' }}></div>

                {/* Fine Dot Grid Pattern */}
                <div className="absolute inset-0 dot-grid opacity-30"></div>
            </div>

            {/* Hero Section */}
            <main ref={heroRef} className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center pt-24">
                {/* Glowing Badge */}
                <div className="hero-text mb-8 inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#101018]/80 border border-white/5 backdrop-blur-md shadow-inner">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary shadow-[0_0_8px_#4edea3]"></span>
                    </span>
                    <span className="font-label-caps text-[10px] tracking-[0.2em] text-[#c3c0ff] font-bold">V1.2 Active Agent Sandboxes</span>
                </div>

                {/* Main Title with Premium Gradient */}
                <h1 className="hero-text text-5xl md:text-8xl font-display font-extrabold tracking-tighter leading-[1.05] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40 drop-shadow-sm select-none">
                    Deploy sandboxes. <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-[#a855f7] to-tertiary font-black">Forge ideas live.</span>
                </h1>

                {/* Compelling Subdescription */}
                <p className="hero-text max-w-2xl text-[15px] md:text-[17px] text-[#918fa1] mb-12 leading-relaxed font-body font-medium select-none">
                    Click below to boot up complete containerized Linux runtimes integrated with custom AI agents, code editors, and live browser logs in milliseconds.
                </p>

                {/* Provision Button with micro-effects */}
                <button
                    onClick={handleCreateSandbox}
                    disabled={isCreating || isLoadingSandbox}
                    className="hero-button group relative overflow-hidden inline-flex items-center justify-center gap-3.5 px-10 py-5 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] text-white rounded-2xl font-code-md text-[13px] font-bold tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_15px_40px_rgba(79,70,229,0.35)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.55)] border border-white/10"
                >
                    {/* Animated Reflection Overlay */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -left-[100%] group-hover:left-[100%] transition-all duration-1000 ease-in-out"></div>

                    {(isCreating || isLoadingSandbox) ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">cycle</span>
                            <span>Allocating sandbox runtime...</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">rocket_launch</span>
                            <span>Launch Sandbox</span>
                        </>
                    )}
                </button>

                {sandboxError && (
                    <p className="mt-5 text-error text-[12px] font-code-md tracking-wide px-4 py-2 rounded-lg bg-error-container/20 border border-error/20 animate-pulse">{sandboxError}</p>
                )}
            </main>

            {/* Premium Highlight Card Showcase Section */}
            <section id="features" className="relative z-10 px-6 py-28 max-w-[1200px] mx-auto border-t border-white/5 select-none">
                <div className="text-center mb-20">
                    <span className="font-label-caps text-[10px] text-primary tracking-[0.3em] font-extrabold uppercase">Engineered Architecture</span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mt-4 tracking-tight">The Ultimate Agent Workspace</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature Card 1 */}
                    <div
                        onMouseMove={handleMouseMove}
                        className="spotlight-card spotlight-border bg-[#09090f]/75 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all flex flex-col gap-5 group shadow-xl relative overflow-hidden"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary-container/20 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/40 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[24px]">box</span>
                        </div>
                        <h3 className="text-[17px] font-bold text-white tracking-wide mt-2">Zero-Config Pods</h3>
                        <p className="text-[13px] text-[#918fa1] leading-relaxed">
                            Complete, secure cloud sandboxes spinning up in under a second. Run web applications, backend APIs, and scripts with preconfigured system packages.
                        </p>
                    </div>

                    {/* Feature Card 2 */}
                    <div
                        onMouseMove={handleMouseMove}
                        className="spotlight-card spotlight-border bg-[#09090f]/75 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all flex flex-col gap-5 group shadow-xl relative overflow-hidden"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-tertiary-container/20 border border-tertiary/20 flex items-center justify-center text-tertiary group-hover:scale-110 group-hover:border-tertiary/40 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[24px]">smart_toy</span>
                        </div>
                        <h3 className="text-[17px] font-bold text-white tracking-wide mt-2">Autonomous Agent</h3>
                        <p className="text-[13px] text-[#918fa1] leading-relaxed">
                            An integrated AI co-developer that writes premium features, builds robust pipelines, compiles source trees, and automatically self-heals terminal exceptions.
                        </p>
                    </div>

                    {/* Feature Card 3 */}
                    <div
                        onMouseMove={handleMouseMove}
                        className="spotlight-card spotlight-border bg-[#09090f]/75 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all flex flex-col gap-5 group shadow-xl relative overflow-hidden"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-[#ec4899]/10 border border-[#ec4899]/20 flex items-center justify-center text-[#ec4899] group-hover:scale-110 group-hover:border-[#ec4899]/40 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[24px]">terminal</span>
                        </div>
                        <h3 className="text-[17px] font-bold text-white tracking-wide mt-2">Workspace Console</h3>
                        <p className="text-[13px] text-[#918fa1] leading-relaxed">
                            Fully interactive shell interface, robust Monaco text editor, customizable mobile-frame preview panels, and real-time console feedback.
                        </p>
                    </div>
                </div>
            </section>

            {/* Performance Statistics Metrics */}
            <section id="performance" className="relative z-10 px-6 py-24 max-w-[1200px] mx-auto border-t border-white/5 select-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col gap-2.5">
                        <span className="text-4xl md:text-6xl font-display font-black text-gradient bg-gradient-to-r from-primary to-[#818cf8]">&lt; 0.8s</span>
                        <span className="text-[12px] font-code-md text-outline uppercase tracking-widest font-bold mt-1">Boot Time Provisioning</span>
                        <p className="text-[12.5px] text-[#918fa1] leading-relaxed max-w-xs mx-auto mt-2">Containers initialize from cold caches instantly, minimizing load latency to zero.</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <span className="text-4xl md:text-6xl font-display font-black text-gradient bg-gradient-to-r from-[#818cf8] to-tertiary">100%</span>
                        <span className="text-[12px] font-code-md text-outline uppercase tracking-widest font-bold mt-1">Kernel Isolation</span>
                        <p className="text-[12.5px] text-[#918fa1] leading-relaxed max-w-xs mx-auto mt-2">Each environment resides in an isolated MicroVM, ensuring absolute security and performance.</p>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <span className="text-4xl md:text-6xl font-display font-black text-gradient bg-gradient-to-r from-tertiary to-[#22d3ee]">100K+</span>
                        <span className="text-[12px] font-code-md text-outline uppercase tracking-widest font-bold mt-1">API Compute Units</span>
                        <p className="text-[12.5px] text-[#918fa1] leading-relaxed max-w-xs mx-auto mt-2">Generous compute resources pre-allocated to execute comprehensive model computations.</p>
                    </div>
                </div>
            </section>

            {/* Tech Stack Banner */}
            <footer className="relative z-10 py-16 border-t border-white/5 bg-[#08080c]/50 backdrop-blur-md select-none text-center">
                <div className="max-w-4xl mx-auto px-6 flex flex-col gap-5 items-center">
                    <span className="font-label-caps text-[9px] text-outline/50 tracking-[0.25em] font-extrabold uppercase">POWERING MODERN ENVIRONMENTS</span>
                    <div className="flex flex-wrap gap-8 md:gap-14 justify-center items-center opacity-40 hover:opacity-60 transition-opacity mt-2">
                        <span className="font-display text-[15px] font-extrabold tracking-tight text-white flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">javascript</span>NODE.JS</span>
                        <span className="font-display text-[15px] font-extrabold tracking-tight text-white flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">css</span>TAILWIND</span>
                        <span className="font-display text-[15px] font-extrabold tracking-tight text-white flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">widgets</span>REACT.JS</span>
                        <span className="font-display text-[15px] font-extrabold tracking-tight text-white flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">terminal</span>LINUX SHELL</span>
                    </div>
                    </div>
            </footer>
        </div>
    );
}
