
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev === 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 20); // Adjust speed here

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center text-white overflow-hidden"
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,68,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,68,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo / Title */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-8 flex flex-col items-center"
        >
            <img src="/logo.png" alt="DRSE.G Logo" className="h-24 w-auto mb-6 object-contain animate-pulse" />
            <h1 className="font-display font-bold text-2xl tracking-[0.2em]">DRSE.G</h1>
        </motion.div>

        {/* Counter */}
        <div className="font-display text-8xl md:text-9xl font-bold tabular-nums leading-none relative">
           <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
             {count}%
           </span>
           {/* Glitch Duplicate */}
           <motion.span 
             className="absolute inset-0 text-blue-600 mix-blend-color-dodge opacity-0"
             animate={{ 
                opacity: [0, 0.5, 0, 0.3, 0],
                x: [-2, 2, -1, 3, 0],
                y: [1, -1, 2, -2, 0]
             }}
             transition={{ repeat: Infinity, duration: 0.5, repeatDelay: 2 }}
           >
             {count}%
           </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 mt-8 rounded-full overflow-hidden relative">
            <motion.div 
                className="absolute top-0 left-0 h-full bg-blue-600"
                initial={{ width: "0%" }}
                animate={{ width: `${count}%` }}
            />
        </div>

        {/* Status Text */}
        <div className="mt-4 font-mono text-xs text-blue-400 flex items-center gap-2">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
            />
            <span>INITIALIZING SYSTEM PROTOCOLS...</span>
        </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-blue-600/50" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-blue-600/50" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-blue-600/50" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-blue-600/50" />

    </motion.div>
  );
};

export default LoadingScreen;
