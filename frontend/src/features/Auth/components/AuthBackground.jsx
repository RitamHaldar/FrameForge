import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const CODE_SNIPPETS = [
  "// FrameForge OS v3.0.0",
  "// Initializing authentication module...",
  "",
  "const engine = new ForgeEngine({",
  "  mode: 'advanced',",
  "  gpuAcceleration: true,",
  "  theme: 'dark-matter'",
  "});",
  "",
  "await engine.connect({",
  "  protocol: 'wss',",
  "  endpoint: '/api/v1/stream'",
  "});",
  "",
  "console.log('Ready to forge.');",
];

export default function AuthBackground() {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= CODE_SNIPPETS.length) {
      // Loop: Wait 3 seconds, then restart the animation
      const loopTimeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 3000);
      return () => clearTimeout(loopTimeout);
    }

    const currentLine = CODE_SNIPPETS[currentLineIndex];

    const typingInterval = setTimeout(() => {
      if (currentCharIndex < currentLine.length) {
        setDisplayedLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = '';
          }
          newLines[currentLineIndex] += currentLine[currentCharIndex];
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      } else {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }, Math.random() * 30 + 10); // random typing speed

    return () => clearTimeout(typingInterval);
  }, [currentLineIndex, currentCharIndex]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Dynamic Animated Grid */}
      <motion.div 
        className="hidden md:block absolute inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        animate={{
          backgroundPosition: ["0px 0px", "60px 60px"]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating Glowing Orbs (Aurora Effect) */}
      <motion.div
        animate={{
          x: [-120, 120, -120],
          y: [-60, 120, -60],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-indigo-500/10 blur-[130px] z-0 pointer-events-none"
      />
      <motion.div
        animate={{
          x: [120, -120, 120],
          y: [60, -120, 60],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] max-w-[700px] rounded-full bg-amber-500/5 blur-[150px] z-0 pointer-events-none"
      />
      <motion.div
        animate={{
          x: [60, -60, 60],
          y: [-60, 60, -60],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="hidden md:block absolute top-[20%] right-[20%] w-[35vw] h-[35vw] max-w-[450px] rounded-full bg-violet-600/10 blur-[120px] z-0 pointer-events-none"
      />

      {/* Subtle vignette/fade so it doesn't distract the form */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050505]/70 to-[#050505] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.85)_100%)] z-10" />

      {/* Terminal Content */}
      <div className="hidden md:block absolute inset-0 p-8 lg:p-24 opacity-80 font-mono-data text-sm md:text-base text-primary/70 z-0">
        <div className="flex items-center gap-2 mb-16 opacity-70 border-b border-outline-variant/30 pb-4 max-w-2xl">
          <Terminal className="w-5 h-5" /> 
          <span>frameforge_os // auth_module</span>
        </div>
        
        <div className="space-y-1 text-primary/60 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          {displayedLines.length === 0 && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary align-middle"
            />
          )}
          {displayedLines.map((line, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-pre"
            >
              <span>{line}</span>
              {idx === displayedLines.length - 1 && (
                <motion.div
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-primary align-middle ml-1"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
