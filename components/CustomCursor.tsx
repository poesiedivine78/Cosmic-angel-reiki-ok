
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, alpha: number}[]>([]);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');

      // Add a particle
      setParticles(prev => [
        ...prev.slice(-15),
        { id: particleIdRef.current++, x: e.clientX, y: e.clientY, alpha: 1 }
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({ ...p, alpha: p.alpha - 0.1 })).filter(p => p.alpha > 0));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] transition-transform duration-100 ease-out flex items-center justify-center"
        style={{ 
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div className="w-1.5 h-1.5 bg-[#C084FC] rounded-full shadow-[0_0_15px_#C084FC]"></div>
        <div className="absolute inset-0 border border-[#C084FC] opacity-30 rounded-full animate-ping"></div>
      </div>

      {particles.map(p => (
        <div 
          key={p.id}
          className="fixed top-0 left-0 w-1 h-1 bg-[#C084FC] rounded-full pointer-events-none z-[9998]"
          style={{ 
            transform: `translate(${p.x}px, ${p.y}px)`,
            opacity: p.alpha,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <style>{`
        * { cursor: none !important; }
      `}</style>
    </>
  );
};

export default CustomCursor;
