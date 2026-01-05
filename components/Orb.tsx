
import React, { useState } from 'react';

interface OrbProps {
  color: string;
  size?: string;
  label?: string;
  description?: string;
  interactive?: boolean;
  onClick?: () => void;
}

const Orb: React.FC<OrbProps> = ({ color, size = '300px', label, description, interactive = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    setIsClicked(true);
    if (onClick) onClick();
    if (window.innerWidth < 768) {
      setIsHovered(!isHovered);
    }
    setTimeout(() => setIsClicked(false), 800);
  };

  return (
    <div 
      className={`relative flex items-center justify-center transition-all duration-700 ${interactive ? 'cursor-pointer' : 'pointer-events-none'}`}
      style={{ 
        width: size, 
        height: size,
        transform: isHovered ? 'scale(1.2) translateY(-5px)' : isClicked ? 'scale(0.95)' : 'scale(1)'
      }}
      onMouseEnter={() => interactive && window.innerWidth >= 768 && setIsHovered(true)}
      onMouseLeave={() => interactive && window.innerWidth >= 768 && setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Aura / Halo externe */}
      <div 
        className={`absolute inset-0 rounded-full blur-[25px] md:blur-[45px] transition-all duration-1000 ${isHovered ? 'opacity-80 scale-150' : 'opacity-30 scale-110'} animate-pulse`}
        style={{ backgroundColor: color }}
      ></div>
      
      {/* Onde de choc au clic */}
      {isClicked && (
        <div 
          className="absolute inset-[-50%] rounded-full border border-white/40 animate-[ping_0.8s_ease-out_infinite]"
          style={{ borderColor: color }}
        ></div>
      )}
      
      {/* Corps principal de l'orbe (Sphère 3D) */}
      <div 
        className="absolute inset-0 rounded-full transition-all duration-500 overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, ${color} 40%, #000 100%)`,
          boxShadow: isHovered ? `0 0 50px ${color}88, inset 0 0 20px rgba(255,255,255,0.4)` : `inset 0 0 15px rgba(255,255,255,0.2)`,
          border: `1px solid ${color}66`
        }}
      >
        {/* Reflet de surface (Glint) */}
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-gradient-to-br from-white/60 to-transparent rounded-full blur-sm"></div>
        
        {/* Coeur énergétique pulsant */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
           <div className="w-[40%] h-[40%] rounded-full animate-ping" style={{ backgroundColor: color }}></div>
        </div>

        {/* Shimmer interne */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 transform translate-x-[-100%] animate-[shimmer_4s_infinite]"></div>
      </div>

      {/* Anneaux de Fresnel (Bordures lumineuses) */}
      <div className={`absolute inset-[-2px] rounded-full border border-white/20 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>

      {/* Point central (Core) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_white] transition-transform duration-500"
          style={{ 
            transform: isClicked ? 'scale(15)' : 'scale(1)', 
            opacity: isClicked ? 0 : 0.8 
          }}
        ></div>
      </div>

      {/* Tooltip Chakra */}
      {interactive && label && (
        <div className={`absolute whitespace-nowrap px-5 py-3 glass rounded-2xl border border-white/10 transition-all duration-500 z-50
          ${window.innerWidth < 768 ? 'left-1/2 -translate-x-1/2 -top-20' : 'left-full ml-10'} 
          ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}`}>
          <div className="flex items-center gap-3 mb-1">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
             <p className="text-[10px] md:text-xs font-black tracking-[0.3em] uppercase" style={{ color: color }}>{label}</p>
          </div>
          <p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-[0.2em] italic">"{description}"</p>
        </div>
      )}
    </div>
  );
};

export default Orb;
