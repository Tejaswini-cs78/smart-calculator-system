import React, { useMemo } from 'react';

const SYMBOLS = ['+', '−', '×', '÷', '√', 'π', '∑', '∫', 'sin', 'cos', 'tan', 'log', 'x²', 'x³', 'n!'];

export default function BackgroundBubbles() {
  // Generate floating glass bubbles, light orbs, and math symbols in Pink 🩷, Yellow 🟡, and Light Green 🍏
  const elements = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const isBubble = i % 3 === 0;
      const isSymbol = i % 3 === 1;
      // isParticle = i % 3 === 2

      // Color distribution: 0 = Soft Pink 🩷, 1 = Light Yellow 🟡, 2 = Light Green 🍏
      const colorScheme = i % 3;

      let colorClass = '';
      let borderClass = '';
      let bgClass = '';
      let glowColor = '';

      if (colorScheme === 0) {
        // Soft Pink 🩷
        colorClass = 'text-pink-300/25 dark:text-pink-300/30';
        borderClass = 'border-pink-300/25';
        bgClass = 'bg-pink-400/10';
        glowColor = 'rgba(244, 114, 182, 0.45)';
      } else if (colorScheme === 1) {
        // Light Yellow 🟡
        colorClass = 'text-amber-200/25 dark:text-amber-200/30';
        borderClass = 'border-yellow-300/25';
        bgClass = 'bg-yellow-300/10';
        glowColor = 'rgba(253, 224, 71, 0.45)';
      } else {
        // Light Green / Apple Green 🍏
        colorClass = 'text-emerald-300/25 dark:text-emerald-300/30';
        borderClass = 'border-emerald-300/25';
        bgClass = 'bg-emerald-400/10';
        glowColor = 'rgba(134, 239, 172, 0.45)';
      }

      return {
        id: i,
        type: isBubble ? 'bubble' : isSymbol ? 'symbol' : 'particle',
        symbol: SYMBOLS[i % SYMBOLS.length],
        left: `${(i * 100) / 30 + (Math.sin(i * 2) * 3 + 2)}%`,
        top: `${((i * 37) % 90) + 5}%`,
        size: isBubble 
          ? `${Math.floor(Math.sin(i) * 22 + 34)}px` 
          : isSymbol 
          ? `${Math.floor(Math.sin(i) * 8 + 18)}px` 
          : `${Math.floor(Math.sin(i) * 12 + 10)}px`,
        duration: `${Math.floor(10 + (i % 7) * 3)}s`,
        delay: `${(i * 0.4).toFixed(1)}s`,
        opacity: isBubble ? 0.22 : isSymbol ? 0.2 : 0.3,
        colorClass,
        borderClass,
        bgClass,
        glowColor,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Dark Glassy Base Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c0e1a] via-[#111425] to-[#0a0c18] transition-colors duration-500" />

      {/* Tri-Color Ambient Glow Orbs: Soft Pink 🩷 + Light Yellow 🟡 + Light Green 🍏 */}
      {/* 1. Top-Left Soft Pink Glow 🩷 */}
      <div 
        className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full blur-[130px] animate-pulse-slow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.25) 0%, rgba(236, 72, 153, 0.16) 50%, transparent 80%)',
          animationDuration: '8s'
        }} 
      />

      {/* 2. Top-Right Light Yellow Glow 🟡 */}
      <div 
        className="absolute -top-20 -right-20 w-[32rem] h-[32rem] rounded-full blur-[120px] animate-pulse-slow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(253, 224, 71, 0.22) 0%, rgba(250, 204, 21, 0.15) 50%, transparent 80%)',
          animationDelay: '2s',
          animationDuration: '10s'
        }} 
      />

      {/* 3. Center Light Green / Apple Green Glow 🍏 */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] rounded-full blur-[140px] pointer-events-none animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(134, 239, 172, 0.2) 0%, rgba(74, 222, 128, 0.14) 60%, transparent 85%)',
          animationDelay: '1s',
          animationDuration: '12s'
        }} 
      />

      {/* 4. Bottom-Left Soft Rose-Pink Glow 🩷 */}
      <div 
        className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] rounded-full blur-[140px] animate-pulse-slow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(244, 114, 182, 0.12) 50%, transparent 80%)',
          animationDelay: '3.5s',
          animationDuration: '9s'
        }} 
      />

      {/* 5. Bottom-Right Warm Light Yellow Glow 🟡 */}
      <div 
        className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] rounded-full blur-[110px] animate-pulse-slow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.2) 0%, rgba(253, 224, 71, 0.14) 50%, transparent 80%)',
          animationDelay: '2.5s',
          animationDuration: '11s'
        }} 
      />

      {/* Continuous Infinitely Floating Glass Bubbles, Particles & Math Symbols */}
      {elements.map((el) => {
        if (el.type === 'bubble') {
          return (
            <div
              key={el.id}
              className={`absolute rounded-full border ${el.borderClass} ${el.bgClass} backdrop-blur-sm animate-float pointer-events-none shadow-sm`}
              style={{
                left: el.left,
                top: el.top,
                width: el.size,
                height: el.size,
                animationDuration: el.duration,
                animationDelay: el.delay,
                opacity: el.opacity,
              }}
            />
          );
        }

        if (el.type === 'symbol') {
          return (
            <div
              key={el.id}
              className={`absolute font-mono font-bold ${el.colorClass} animate-float pointer-events-none`}
              style={{
                left: el.left,
                top: el.top,
                fontSize: el.size,
                animationDuration: el.duration,
                animationDelay: el.delay,
                opacity: el.opacity,
              }}
            >
              {el.symbol}
            </div>
          );
        }

        // Particle orb
        return (
          <div
            key={el.id}
            className="absolute rounded-full animate-float pointer-events-none"
            style={{
              left: el.left,
              top: el.top,
              width: el.size,
              height: el.size,
              background: `radial-gradient(circle, ${el.glowColor} 0%, transparent 70%)`,
              boxShadow: `0 0 10px ${el.glowColor}`,
              animationDuration: el.duration,
              animationDelay: el.delay,
              opacity: el.opacity,
            }}
          />
        );
      })}
    </div>
  );
}
