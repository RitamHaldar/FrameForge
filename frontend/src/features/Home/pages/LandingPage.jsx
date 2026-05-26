import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useHome } from '../Hooks/useHome';

export default function LandingPage() {
  const navigate = useNavigate();
  const { initWorkspace } = useHome();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.body.style.setProperty('--mouse-x', `${x}%`);
      document.body.style.setProperty('--mouse-y', `${y}%`);
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCreateSandbox = async () => {
    setIsCreating(true);
    // Force new workspace to bypass any locally stored sandbox
    await initWorkspace(true);
    setIsCreating(false);
    navigate('/dashboard');
  };

  return (
    <div className="font-body-md text-body-md selection:bg-tertiary-container selection:text-on-tertiary-container">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface-dim/70 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center h-16 px-margin-desktop max-w-container-max mx-auto">
          <div className="font-display-lg text-2xl font-bold text-primary tracking-tighter">FrameForge</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-primary font-bold border-b-2 border-primary pb-1 font-label-caps text-label-caps" href="#">Platform</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-label-caps" href="#">Solutions</a>
            <a className="text-on-surface-variant hover:text-on-surface transition-colors font-label-caps text-label-caps" href="#">Docs</a>
          </div>
          <button 
            onClick={handleCreateSandbox}
            disabled={isCreating}
            className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-label-caps text-label-caps font-bold active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(195,192,255,0.3)] disabled:opacity-50"
          >
            {isCreating ? 'Creating...' : 'Create Sandbox'}
          </button>
        </div>
      </nav>
      {/* Main Content */}
      <main className="relative pt-32">
        {/* Atmospheric Background Glows */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[20%] right-[-5%] w-[600px] h-[600px] bg-tertiary-fixed-dim/5 rounded-full blur-[150px]"></div>
        </div>
        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop text-center mb-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-tertiary/20 bg-tertiary/5 text-tertiary-fixed-dim font-label-caps text-label-caps">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </span>
            v2.4.0 Live Engine
          </div>
          <h1 className="font-display-lg text-[64px] leading-[1.1] font-bold text-on-surface mb-6 tracking-tight">
            Forge the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">Future of Frontend.</span>
          </h1>
          <p className="font-body-md text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            The elite sandbox environment for AI-orchestrated UI development. Deploy micro-apps in seconds with zero configuration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={handleCreateSandbox}
              disabled={isCreating}
              className="relative group px-8 py-4 rounded-xl bg-gradient-to-br from-primary to-secondary text-on-primary font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-primary/20 disabled:opacity-50"
            >
              <span className="relative z-10">{isCreating ? 'Creating Sandbox...' : 'Create Sandbox'}</span>
              <div className="absolute inset-0 rounded-xl border border-primary/50 group-hover:border-tertiary/50 transition-colors"></div>
              <div className="absolute inset-0 rounded-xl blur-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <button className="px-8 py-4 rounded-xl glass-panel text-on-surface font-semibold hover:bg-surface-variant/50 transition-all border-outline-variant/30">
              View Enterprise Demo
            </button>
          </div>
          {/* Mockup */}
          <div className="relative max-w-5xl mx-auto animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-tertiary/20 to-secondary/20 rounded-2xl blur-3xl opacity-30"></div>
            <div className="relative glass-panel rounded-2xl p-2 border border-outline-variant/50 overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/30 bg-surface-container-lowest/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                </div>
                <div className="mx-auto flex items-center gap-2 px-3 py-1 bg-surface-container-lowest border border-outline-variant/50 rounded-md text-[10px] font-label-caps text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  frameforge.dev/sandbox/a7-neural-flow
                </div>
              </div>
              <img alt="FrameForge Dashboard" className="w-full h-auto rounded-b-xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700" data-alt="A high-fidelity glassmorphic dashboard interface for a code development tool. The UI features deep obsidian backgrounds, sleek sidebar navigation with icons, and a central workspace showing a vibrant code editor with syntax highlighting in lavender and mint green. Transparent panels and 0.5px glowing indigo borders create depth. The lighting is low-key with ambient atmospheric glows of emerald and indigo reflecting off the glass surfaces." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXNQ5SdF-CxnE0mRzEiNxtLPKbjtDe_p_xOjCp_Wi7eXr9IU45BZcefHg4wR5gCGmrJL_6VJFbpiYnJgtoJXN4XPSVQL7awk445ixoQeyyR-NBhY4zjJ1S-iel0pgF6j8e5wf_mGUyx0MqbfupyOtrDtqcBqwTpqW6t5AnpaaZbM_WGGJX5lgfk7aoYrIWPQ62pEZHrFhnVoYFn3EBzQIBBPGFVDj4Tvvo_BUOSd6GIIXAwYM6THaDj2LiPNkoWLlVGSlxnC7VGWvm"/>
            </div>
          </div>
        </section>
        {/* Feature Grid Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-24 border-t border-outline-variant/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 glass-panel rounded-2xl hover:border-tertiary/40 transition-all duration-500">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl font-light">psychology</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-3">Neural Orchestration</h3>
              <p className="text-on-surface-variant font-body-sm leading-relaxed">
                LLM-driven component synthesis that understands your design system tokens and architectural patterns instantly.
              </p>
            </div>
            <div className="group p-8 glass-panel rounded-2xl hover:border-primary/40 transition-all duration-500">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-tertiary/10 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-tertiary text-3xl font-light">query_stats</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-3">Real-time Telemetry</h3>
              <p className="text-on-surface-variant font-body-sm leading-relaxed">
                Deep-level engine metrics tracking render cycles, hydration speed, and memory pressure in a real-time stream.
              </p>
            </div>
            <div className="group p-8 glass-panel rounded-2xl hover:border-secondary/40 transition-all duration-500">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary/10 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-3xl font-light">bolt</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-surface mb-3">Zero-latency Deploys</h3>
              <p className="text-on-surface-variant font-body-sm leading-relaxed">
                Instant global edge distribution using our proprietary protocol. See your changes live in under 200ms.
              </p>
            </div>
          </div>
        </section>
        {/* Built for the 1% Section */}
        <section className="relative py-32 overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <div>
              <h2 className="font-display-lg text-headline-lg text-primary mb-6">Engineered for the 1%.</h2>
              <p className="font-body-md text-lg text-on-surface-variant mb-8 leading-relaxed">
                Standard tools are built for the masses. FrameForge is built for the architects who demand surgical precision and industrial-grade throughput.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="flex-1 glass-panel p-4 rounded-xl flex justify-between items-center border-l-2 border-l-tertiary">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">CORE CLOCK</span>
                    <span className="font-code-md text-code-md text-tertiary">3.8 GHZ SYNC</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="flex-1 glass-panel p-4 rounded-xl flex justify-between items-center border-l-2 border-l-primary">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">LATENCY THRESHOLD</span>
                    <span className="font-code-md text-code-md text-primary">&lt; 0.4ms</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="flex-1 glass-panel p-4 rounded-xl flex justify-between items-center border-l-2 border-l-secondary">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">RENDER LOAD</span>
                    <span className="font-code-md text-code-md text-secondary">OPTIMAL (144FPS)</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-tertiary/10 blur-[80px] rounded-full"></div>
              <div className="relative bg-terminal-bg rounded-xl border border-outline-variant p-6 font-code-md text-code-md shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-6 opacity-60">
                  <span>frameforge_os // kernel_shell</span>
                  <span className="material-symbols-outlined text-xs">terminal</span>
                </div>
                <div className="space-y-2 text-on-surface-variant">
                  <p><span className="text-tertiary-fixed-dim">λ</span> init --profile=performance</p>
                  <p className="text-primary-fixed">Booting neural orchestrator core...</p>
                  <p>[OK] Memory allocated: 4.2GB Heap</p>
                  <p>[OK] JIT Compiler: Optimized (v8-gen)</p>
                  <p className="text-tertiary">[SUCCESS] Connection established to global_mesh</p>
                  <p className="animate-pulse">_</p>
                </div>
                {/* Floating HUD Overlay */}
                <div className="absolute bottom-4 right-4 glass-panel px-3 py-2 rounded-lg text-[10px] flex items-center gap-2 border-tertiary/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
                  Uptime: 99.999%
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-24 mb-32">
          <div className="relative glass-panel rounded-3xl p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-tertiary/5"></div>
            <div className="relative z-10">
              <h2 className="font-display-lg text-4xl md:text-5xl font-bold mb-6">Ready to forge?</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto mb-10 text-lg">
                Join the elite community of developers building the next generation of high-performance web applications.
              </p>
              <button 
                onClick={handleCreateSandbox}
                disabled={isCreating}
                className="bg-primary text-on-primary-fixed px-10 py-5 rounded-full font-bold text-xl hover:shadow-[0_0_30px_rgba(226,223,255,0.4)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isCreating ? 'Initializing...' : 'Initialize Sandbox'}
              </button>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-sidebar-bg border-t border-outline-variant/20 w-full py-12">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-desktop max-w-container-max mx-auto gap-gutter">
          <div className="flex flex-col gap-2">
            <div className="font-display-lg text-xl font-bold text-primary">FrameForge</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 FrameForge AI. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-on-surface-variant hover:text-tertiary transition-colors font-label-caps text-label-caps opacity-80 hover:opacity-100" href="#">Privacy</a>
            <a className="text-on-surface-variant hover:text-tertiary transition-colors font-label-caps text-label-caps opacity-80 hover:opacity-100" href="#">Status</a>
            <a className="text-on-surface-variant hover:text-tertiary transition-colors font-label-caps text-label-caps opacity-80 hover:opacity-100" href="#">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
