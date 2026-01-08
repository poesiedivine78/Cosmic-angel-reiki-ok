
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import NebulaBackground from './components/NebulaBackground';
import Orb from './components/Orb';
import { SERVICES, CHAKRAS, PATHOLOGIES, PROGRAMS, BOOKS, TESTIMONIALS, MANIFESTO, MY_STORY, FAQ_DATA, REIKI_HISTORY, VIBRATIONAL_QUOTES } from './constants';
import { Sparkles, CheckCircle2, ArrowRight, Send, Facebook, Activity, Moon, Zap, Brain, Heart, Shield, Compass, History, Clock, Info, Stars, ExternalLink, Crown, Check, Quote as QuoteIcon, ArrowDownCircle, ShieldCheck, Eye, Wind, Layers, Volume2, VolumeX, Menu, X, ChevronRight, HelpCircle, ChevronDown, Lock, LockOpen, Flame, Navigation, Play, PlayCircle } from 'lucide-react';

const iconsMap: Record<string, React.ReactNode> = {
  Activity: <Activity size={20} />,
  Moon: <Moon size={20} />,
  Zap: <Zap size={20} />,
  Brain: <Brain size={20} />,
  Heart: <Heart size={20} />,
  Shield: <Shield size={20} />,
  Compass: <Compass size={20} />,
  History: <History size={20} />,
  Stars: <Stars size={20} />,
  Eye: <Eye size={20} />,
  Wind: <Wind size={20} />,
  Layers: <Layers size={20} />
};

const GLOW_WORDS = [
  'Lumière', 'Éveil', 'Ascension', 'Satori', 'Stellaire', 'Divine', 'Sacrée', 
  'Rayon', 'Pureté', 'Source', 'Starseed', 'Phoenix', 'Guérison', 'Âme', 'ADN',
  'Stellaires', 'Sacré', 'Étoiles', 'Vibratoire', 'Fréquence', 'Renaissance'
];

const GlowText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  const regex = new RegExp(`(${GLOW_WORDS.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        GLOW_WORDS.some(w => w.toLowerCase() === part.toLowerCase()) ? (
          <span key={i} className="lumiere-glow font-bold text-white">{part}</span>
        ) : (
          part
        )
      )}
    </>
  );
};

const playChakraSound = (frequencyStr: string) => {
  try {
    const frequency = parseInt(frequencyStr.replace(' Hz', ''));
    if (isNaN(frequency)) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 2);
    setTimeout(() => { audioCtx.close(); }, 2500);
  } catch (error) {
    console.warn("Audio context blocked");
  }
};

const scrollToSection = (id: string, closeMenu?: () => void) => {
  if (closeMenu) closeMenu();
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const offsetPosition = elementRect - bodyRect - offset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
};

/**
 * Lecteur Vidéo Plein Écran (Lightbox)
 */
const VideoPlayer: React.FC<{ url: string | null; onClose: () => void }> = ({ url, onClose }) => {
  if (!url) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-4 md:p-10"
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 md:top-10 md:right-10 text-white/50 hover:text-white transition-all p-3 glass rounded-full z-[610] hover:rotate-90"
      >
        <X size={32} />
      </button>

      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-[450px] aspect-[9/16] glass rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(139,92,246,0.3)] bg-black"
      >
        <video 
          src={url} 
          className="w-full h-full object-cover"
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
        />
      </motion.div>
    </motion.div>
  );
};

const CelestialVideo: React.FC<{ url: string; title: string; subtitle: string; poster?: string; onOpen: (url: string) => void }> = ({ url, title, subtitle, poster, onOpen }) => {
  return (
    <div className="flex flex-col gap-6">
      <div 
        onClick={() => onOpen(url)}
        className="relative group cursor-pointer"
      >
        <div className="absolute -inset-6 bg-gradient-to-tr from-violet-600/20 to-blue-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>
        
        <div className="glass rounded-[40px] overflow-hidden aspect-[9/16] w-full max-w-[320px] mx-auto border border-white/10 shadow-2xl relative transition-transform duration-700 group-hover:scale-[1.02]">
          <div className="absolute inset-0 z-0">
             <img 
               src={poster || "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=800"} 
               alt={title} 
               className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          </div>

          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full glass border border-white/20 flex items-center justify-center shadow-2xl group-hover:bg-violet-600/20 group-hover:scale-110 transition-all duration-500 mb-6">
               <PlayCircle size={48} className="text-white" />
            </div>
            <h4 className="text-xl font-black text-white mb-2 uppercase tracking-widest"><GlowText text={title} /></h4>
            <p className="text-[9px] text-white/60 font-medium uppercase tracking-[0.3em]">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="text-center lg:text-left px-4">
        <button 
          onClick={() => onOpen(url)}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase text-violet-400 hover:text-white hover:bg-violet-600 transition-all tracking-[0.3em] shadow-xl"
        >
          Ouvrir le Portail
        </button>
      </div>
    </div>
  );
};

const Lightbox: React.FC<{ src: string | null; onClose: () => void }> = ({ src, onClose }) => {
  if (!src) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10 cursor-zoom-out"
    >
      <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-[310]">
        <X size={40} strokeWidth={1} />
      </button>
      <motion.img
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        src={src}
        className="max-w-full max-h-[90vh] rounded-2xl shadow-[0_0_80px_rgba(139,92,246,0.2)] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
};

const QuickNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const items = [
    { name: 'ÉVEIL', id: 'éveil' },
    { name: 'HISTOIRE', id: 'histoire' },
    { name: 'SAGESSE', id: 'reiki-history' },
    { name: 'ÉNERGIE', id: 'chakra-system' },
    { name: 'DIAGNOSTIC', id: 'quand-consulter' },
    { name: 'SOINS REIKI', id: 'soin' },
    { name: 'PHOENIX', id: 'phoenix' },
    { name: 'RITUEL', id: 'ritual' },
    { name: 'LIVRES', id: 'livres' },
    { name: 'FAQ', id: 'faq' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[150] flex flex-col items-start gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: -20 }}
            className="glass rounded-3xl p-6 mb-2 border border-violet-500/30 shadow-2xl min-w-[200px]"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400 mb-6 border-b border-white/5 pb-2">Navigation Rapide</p>
            <div className="flex flex-col gap-4">
              {items.map((item, idx) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsOpen(false);
                  }}
                  className="text-left text-xs font-bold text-white/70 hover:text-violet-400 transition-colors tracking-widest uppercase hover:translate-x-2 transition-transform duration-300"
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg shadow-violet-500/20 ${isOpen ? 'bg-violet-600 text-white rotate-0' : 'glass text-white/70 hover:bg-white/10'}`}
      >
        {isOpen ? <X size={24} /> : <Navigation size={24} className="rotate-45" />}
      </button>
    </div>
  );
};

const SoundControl = () => {
  const [isMuted, setIsMuted] = useState(true);
  return (
    <div className="fixed bottom-6 right-6 z-[150]">
      <button
        onClick={() => setIsMuted(!isMuted)}
        className="w-14 h-14 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all shadow-lg"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="text-violet-400" />}
      </button>
    </div>
  );
};

const MagneticSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{ opacity: 1, scale: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`glass relative overflow-hidden transition-all duration-500 ${className}`}
    >
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(192, 132, 252, 0.1), transparent 40%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      {children}
    </div>
  );
};

const BodySilhouette: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 220" className={`absolute pointer-events-none drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] ${className}`}>
    <path 
      d="M50,15 C42,15 35,22 35,32 C35,42 42,52 50,52 C58,52 65,42 65,32 C65,22 58,15 50,15 M50,52 L50,160 M30,85 L50,65 L70,85 M35,205 L50,160 L65,205" 
      fill="none" 
      stroke="rgba(192, 132, 252, 0.4)" 
      strokeWidth="0.8" 
      strokeLinecap="round"
      className="animate-pulse"
    />
    <circle cx="50" cy="32" r="12" fill="none" stroke="rgba(192, 132, 252, 0.2)" strokeWidth="0.3" />
    <rect x="49.5" y="52" width="1" height="108" fill="url(#spine-grad-mob)" opacity="0.5" />
    <defs>
      <linearGradient id="spine-grad-mob" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopMenuItems = [
    { name: 'Éveil', id: 'éveil' },
    { name: 'Histoire', id: 'histoire' },
    { name: 'Soins', id: 'soin' },
    { name: 'Phoenix', id: 'phoenix' },
    { name: 'Livres', id: 'livres' }
  ];

  const fullMenuItems = [
    { name: 'ÉVEIL', id: 'éveil' },
    { name: 'HISTOIRE', id: 'histoire' },
    { name: 'SAGESSE', id: 'reiki-history' },
    { name: 'ÉNERGIE', id: 'chakra-system' },
    { name: 'DIAGNOSTIC', id: 'quand-consulter' },
    { name: 'SOINS REIKI', id: 'soin' },
    { name: 'PHOENIX', id: 'phoenix' },
    { name: 'RITUEL', id: 'ritual' },
    { name: 'LIVRES', id: 'livres' },
    { name: 'FAQ', id: 'faq' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled || isMenuOpen ? 'py-3 glass border-b' : 'py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Stars className="text-white" size={20} />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-sm font-bold tracking-widest uppercase text-white">Michael Furtak</h1>
              <p className="text-[9px] text-violet-400 font-medium tracking-[0.2em] uppercase">Starseed Cosmic Angel</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {desktopMenuItems.map((item) => (
              <button key={item.name} onClick={() => scrollToSection(item.id)} className="text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-violet-400 transition-colors">
                {item.name}
              </button>
            ))}
            <button onClick={() => scrollToSection('ritual')} className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all duration-300 shadow-lg shadow-white/10">
              Poser une Intention
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white transition-transform hover:scale-110 active:scale-95">
            {isMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-2xl flex flex-col items-center justify-center p-6 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass w-full max-w-sm rounded-[40px] p-8 border border-white/10 shadow-2xl flex flex-col gap-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-violet-400">Navigation Rapide</p>
                <Stars size={16} className="text-violet-500/50" />
              </div>
              
              <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                {fullMenuItems.map((item, idx) => (
                  <motion.button 
                    key={item.id} 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => scrollToSection(item.id, () => setIsMenuOpen(false))} 
                    className="text-left text-lg font-black uppercase tracking-widest text-white hover:text-violet-400 transition-all flex items-center justify-between group py-1"
                  >
                    <span>{item.name}</span>
                    <ChevronRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-violet-500" />
                  </motion.button>
                ))}
              </div>
              
              <button 
                onClick={() => scrollToSection('ritual', () => setIsMenuOpen(false))} 
                className="mt-4 w-full py-5 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-violet-500/30 active:scale-95 transition-transform"
              >
                Poser une <span className="lumiere-glow">Intention</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = () => (
  <section id="éveil" className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 pb-12 overflow-hidden">
    <div className="container mx-auto px-6 relative z-10 text-center">
      <MagneticSection>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 animate-bounce-slow">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-white">L'expérience <span className="lumiere-glow">vibratoire</span></span>
        </div>
        <h1 className="text-sm md:text-xl font-black mb-4 tracking-[0.3em] uppercase text-violet-400 lumiere-glow">
          Starseed Cosmic Angel
        </h1>
        <h2 className="text-4xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] md:leading-[0.9] text-white vibratory-heading">
          TRANSFORMER <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-violet-600">L'OMBRE</span> EN <span className="lumiere-glow">LUMIÈRE</span>
        </h2>
        <p className="max-w-2xl mx-auto text-base md:text-xl text-slate-400 serif-quote italic mb-12 px-4">
          "<GlowText text="Réveillez la force stellaire qui sommeille en vous. Par le Reiki Usui & Kundalini, retrouvez l'harmonie parfaite de votre structure d'âme." />"
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <button onClick={() => scrollToSection('quand-consulter')} className="w-full md:w-auto px-8 py-4 md:px-10 md:py-5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform animate-impulse text-white">
            Explorer mes soins
          </button>
          <button onClick={() => scrollToSection('livres')} className="w-full md:w-auto px-8 py-4 md:px-10 md:py-5 rounded-full glass border border-white/10 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors text-white">
            Boutique Amazon
          </button>
        </div>
      </MagneticSection>
    </div>
  </section>
);

const ManifestoSection = () => (
  <section id="manifeste" className="py-16 md:py-24 relative overflow-hidden">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <MagneticSection>
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-violet-400 font-bold mb-6">{MANIFESTO.title}</h3>
        <div className="relative">
          <QuoteIcon className="absolute -top-6 -left-4 md:-top-10 md:-left-6 text-violet-500/10 w-12 h-12 md:w-24 md:h-24" />
          <div className="glass p-8 md:p-16 rounded-[30px] md:rounded-[40px] border border-white/5 relative z-10">
            <p className="text-lg md:text-3xl text-slate-200 leading-[1.6] serif-quote italic">
              <GlowText text={MANIFESTO.text} />
            </p>
          </div>
        </div>
      </MagneticSection>
    </div>
  </section>
);

const StorySection: React.FC<{ onImageClick: (src: string) => void }> = ({ onImageClick }) => (
  <section id="histoire" className="py-20 md:py-32 relative overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-4xl md:text-7xl font-black text-white vibratory-heading uppercase tracking-tighter">Mon <span className="lumiere-glow">Histoire</span></h2>
      </div>
      <div className="space-y-20 md:space-y-32">
        {MY_STORY.chapters.map((chapter, idx) => (
          <MagneticSection key={chapter.id}>
            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 md:gap-24`}>
              <div className="w-full lg:w-1/2 relative group">
                <div 
                  className="rounded-[30px] md:rounded-[40px] overflow-hidden aspect-video md:aspect-square shadow-2xl cursor-zoom-in relative"
                  onClick={() => onImageClick(chapter.image)}
                >
                  <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 transition-colors pointer-events-none"></div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-left">
                <h4 className="text-2xl md:text-4xl font-bold text-white mb-6"><span className="text-violet-500">0{idx + 1}.</span> <GlowText text={chapter.title} /></h4>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-6"><GlowText text={chapter.content} /></p>
                {chapter.quote && <p className="serif-quote italic text-xl md:text-2xl text-white">"<GlowText text={chapter.quote} />"</p>}
              </div>
            </div>
          </MagneticSection>
        ))}
      </div>
    </div>
  </section>
);

const HistorySection: React.FC<{ onImageClick: (src: string) => void }> = ({ onImageClick }) => (
  <section id="reiki-history" className="py-20 bg-slate-950/40">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-violet-400 font-bold mb-4">{REIKI_HISTORY.subtitle}</h3>
        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase"><GlowText text={REIKI_HISTORY.title} /></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {REIKI_HISTORY.history.map((item, i) => (
          <GlassCard key={i} className="p-6 md:p-8 rounded-[30px] flex flex-col gap-6 items-center">
             <div 
               className="w-full aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-lg cursor-zoom-in group"
               onClick={() => onImageClick(item.image)}
             >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105" />
             </div>
             <div className="text-center md:text-left">
                <span className="text-[9px] font-black text-violet-500 uppercase tracking-widest">{item.period}</span>
                <h4 className="text-xl font-bold text-white mb-4 mt-1"><GlowText text={item.title} /></h4>
                <p className="text-sm text-slate-400 leading-relaxed"><GlowText text={item.text} /></p>
             </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

const ChakraSystem = () => {
  const [randomQuote, setRandomQuote] = useState("");
  const [activeChakra, setActiveChakra] = useState(CHAKRAS[0]);
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setRandomQuote(VIBRATIONAL_QUOTES[Math.floor(Math.random() * VIBRATIONAL_QUOTES.length)]); }, []);
  const handleChakraClick = (chakra: any) => {
    setActiveChakra(chakra);
    playChakraSound(chakra.frequency);
    if (window.innerWidth < 1024 && textRef.current) textRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <section id="chakra-system" className="py-20 relative bg-slate-950/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">L'État des <span className="lumiere-glow">CHAKRAS</span></h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative h-[500px] md:h-[650px] flex items-center justify-center">
            <BodySilhouette className="w-full h-full opacity-30 scale-110" />
            {CHAKRAS.map((chakra, idx) => (
              <div key={idx} className={`absolute left-1/2 -translate-x-1/2 ${chakra.pos}`}>
                <Orb color={chakra.color} size={activeChakra.id === chakra.id ? "45px" : "32px"} interactive={true} label={chakra.name} description={chakra.meaning} onClick={() => handleChakraClick(chakra)} />
              </div>
            ))}
          </div>
          <div ref={textRef} className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <GlassCard className="p-6 md:p-8 rounded-[25px] border-red-500/20">
                <div className="flex items-center gap-3 mb-4"><Lock className="text-red-500" size={20} /><h4 className="text-xl font-black text-white uppercase tracking-widest">BLOQUÉ</h4></div>
                <p className="text-slate-300 italic serif-quote text-base">"{activeChakra.blocked}"</p>
              </GlassCard>
              <GlassCard className="p-6 md:p-8 rounded-[25px] border-green-500/20">
                <div className="flex items-center gap-3 mb-4"><LockOpen className="text-green-400" size={20} /><h4 className="text-xl font-black text-white uppercase tracking-widest">OUVERT</h4></div>
                <p className="text-slate-100 italic serif-quote text-base">"{activeChakra.open}"</p>
              </GlassCard>
            </div>
            <div className="glass p-6 md:p-8 rounded-[25px]"><p className="serif-quote text-lg md:text-xl italic text-white/80">"<GlowText text={randomQuote} />"</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PathologiesExplorer: React.FC<{ onVideoOpen: (url: string) => void }> = ({ onVideoOpen }) => {
  const [activeTab, setActiveTab] = useState<'physique' | 'psychique' | 'spirituel'>('physique');
  return (
    <section id="quand-consulter" className="py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white uppercase">QUAND <span className="italic font-light">CONSULTER ?</span></h2>
          <div className="flex gap-2 p-1.5 glass rounded-2xl overflow-x-auto max-w-full">
            {['physique', 'psychique', 'spirituel'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${activeTab === tab ? 'bg-violet-600 text-white' : 'text-slate-500'}`}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {PATHOLOGIES[activeTab].map((p, idx) => (
            <GlassCard key={idx} className="p-8 rounded-[30px] flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-400 mb-6">{iconsMap[p.icon] || <Activity />}</div>
              <h4 className="text-xl md:text-2xl font-bold mb-2 text-white"><GlowText text={p.title} /></h4>
              <p className="text-sm text-slate-400 italic mb-6">"<GlowText text={p.details.origin} />"</p>
              <ul className="space-y-3 mb-8 flex-1">{p.details.benefits.map((b, i) => (<li key={i} className="text-xs text-slate-300 flex items-center gap-3"><div className="w-1 h-1 rounded-full bg-violet-500 shrink-0"></div><GlowText text={b} /></li>))}</ul>
              <button onClick={() => scrollToSection('soin')} className="w-full py-4 glass rounded-2xl text-[9px] font-black uppercase text-white hover:bg-white hover:text-black transition-all">Explorer ce soin</button>
            </GlassCard>
          ))}
        </div>
        
        <MagneticSection>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-violet-600/5 rounded-[50px] p-8 md:p-16 border border-violet-500/10">
            <div className="lg:col-span-4">
              <CelestialVideo 
                url="https://res.cloudinary.com/dwrlivpq1/video/upload/v1767912849/Faire_face_e_ses_traumatisme_teoy9y.mp4" 
                title="Transcender la Douleur" 
                subtitle="Faire face aux traumatismes" 
                onOpen={onVideoOpen}
              />
            </div>
            <div className="lg:col-span-8">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase leading-tight">Libérer les <span className="lumiere-glow">Traumatismes</span></h3>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed italic serif-quote mb-8">
                "La douleur n'est pas une fin en soi, c'est un langage crypté de votre corps qui demande à être entendu. En affrontant l'obscurité de nos traumatismes, nous libérons une lumière jusque-là captive."
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-[10px] font-bold text-violet-400 uppercase tracking-widest"><ShieldCheck size={14} /> Sécurité émotionnelle</div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-[10px] font-bold text-violet-400 uppercase tracking-widest"><Zap size={14} /> Libération énergétique</div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 text-[10px] font-bold text-violet-400 uppercase tracking-widest"><Flame size={14} /> Transmutation</div>
              </div>
            </div>
          </div>
        </MagneticSection>
      </div>
    </section>
  );
};

const Services = () => {
  const categoryColors: Record<string, { title: string, label: string, glow: string }> = {
    physique: { title: 'text-emerald-400', label: 'text-emerald-500', glow: 'shadow-emerald-500/20' },
    psychique: { title: 'text-sky-400', label: 'text-sky-500', glow: 'shadow-sky-500/20' },
    spirituel: { title: 'text-violet-400', label: 'text-violet-500', glow: 'shadow-violet-500/20' }
  };

  return (
    <section id="soin" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16"><h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">NOS SOINS <span className="lumiere-glow">STELLAIRES</span></h2></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {SERVICES.map((service, idx) => (
            <GlassCard key={idx} className="p-8 md:p-12 rounded-[40px] flex flex-col group border-white/5">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-violet-600/20 text-violet-400 border border-violet-500/30">Reiki {service.type}</span>
                  </div>
                  <h4 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight"><GlowText text={service.title} /></h4>
                  <p className="text-lg text-violet-300/80 italic serif-quote">"<GlowText text={service.subtitle} />"</p>
                </div>
                <div className="w-full md:w-auto p-5 glass rounded-2xl flex md:flex-col justify-between items-center text-right shadow-lg border-white/5">
                  <div className="text-3xl md:text-4xl font-black text-white lumiere-glow">{service.price}</div>
                  <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-violet-400" />
                    {service.duration}
                  </div>
                </div>
              </div>
              
              <p className="text-base text-slate-300 leading-relaxed font-light mb-10 border-l-2 border-violet-500/30 pl-6"><GlowText text={service.description} /></p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 flex-1">
                {Object.entries(service.detailedBenefits).map(([key, benefits]) => {
                  const colors = categoryColors[key] || categoryColors.physique;
                  return (
                    <div key={key} className={`p-5 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300`}>
                      <p className={`text-[10px] uppercase font-black tracking-widest mb-4 ${colors.title}`}>{key}</p>
                      <ul className="space-y-4">
                        {benefits.map((b, i) => (
                          <li key={i} className="text-[11px] text-slate-300 leading-snug">
                            <strong className={`${colors.label} block mb-0.5 font-black uppercase text-[8px]`}>{b.label}</strong>
                            <span className="text-slate-400 font-light text-[10px]"><GlowText text={b.text} /></span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group/btn relative overflow-hidden block w-full py-6 rounded-3xl bg-gradient-to-r from-white to-slate-200 text-black text-[12px] font-black uppercase tracking-[0.4em] transition-all duration-500 text-center hover:scale-[1.02] shadow-xl hover:shadow-violet-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-400/30 to-violet-600/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-3">
                   Réserver mon <span className="lumiere-glow">Éveil</span>
                   <Stars size={18} />
                </span>
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const PhoenixSection: React.FC<{ onVideoOpen: (url: string) => void }> = ({ onVideoOpen }) => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(0);
  const weekStyles = [
    { bg: 'from-blue-600/20 to-transparent', text: 'text-blue-400', glow: 'shadow-blue-500/20', icon: 'bg-blue-600', stepColor: 'text-blue-400' },
    { bg: 'from-indigo-600/20 to-transparent', text: 'text-indigo-400', glow: 'shadow-indigo-500/20', icon: 'bg-indigo-600', stepColor: 'text-indigo-400' },
    { bg: 'from-violet-600/20 to-transparent', text: 'text-violet-400', glow: 'shadow-violet-500/20', icon: 'bg-violet-600', stepColor: 'text-violet-400' },
    { bg: 'from-orange-600/20 to-transparent', text: 'text-orange-400', glow: 'shadow-orange-500/20', icon: 'bg-orange-600', stepColor: 'text-orange-400' }
  ];

  return (
    <section id="phoenix" className="py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <GlassCard className="rounded-[40px] md:rounded-[80px] p-8 md:p-20 border-violet-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-[9px] font-black uppercase tracking-widest mb-6 text-white shadow-lg shadow-violet-500/30"><Crown size={12} /> EXCLUSIVITÉ</div>
              <h2 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] text-white tracking-tighter">PROTOCOLE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 lumiere-glow">PHOENIX</span></h2>
              
              <div className="mb-12">
                <CelestialVideo 
                  url="https://res.cloudinary.com/dwrlivpq1/video/upload/v1767913361/vid%C3%A9o_%C3%A9l%C3%A9vation_spirituelle_utddlu.mp4" 
                  title="Paliers d'Ascension" 
                  subtitle="Comprendre son évolution spirituelle" 
                  onOpen={onVideoOpen}
                />
              </div>

              <p className="text-xl md:text-2xl text-slate-300 serif-quote italic mb-10 leading-relaxed"><GlowText text={PROGRAMS[0].description} /></p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PROGRAMS[0].perks.map((p, i) => (
                  <div key={i} className="flex gap-4 items-center p-4 glass rounded-2xl border-white/5 hover:bg-white/5 transition-all">
                    <Check size={18} className="text-orange-500 shrink-0" />
                    <p className="text-slate-300 text-xs tracking-wide leading-tight">
                      <strong className="text-white font-bold uppercase text-[8px] block">{p.label}</strong>
                      {p.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
               {PROGRAMS[0].path.map((s, i) => {
                 const style = weekStyles[i];
                 return (
                   <div key={i} className="flex flex-col gap-2">
                     <button 
                       onClick={() => setSelectedWeek(selectedWeek === i ? null : i)}
                       className={`group w-full glass p-5 md:p-6 rounded-[30px] border transition-all duration-500 flex gap-4 md:gap-6 items-center text-left ${selectedWeek === i ? `border-orange-500/50 bg-gradient-to-br ${style.bg} ${style.glow}` : 'border-white/5 hover:border-white/20'}`}
                     >
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${selectedWeek === i ? `${style.icon} text-white shadow-xl rotate-6` : 'bg-white/5 text-slate-500'}`}>
                          {selectedWeek === i ? <Flame size={24} className="animate-pulse" /> : (iconsMap[s.icon] || <Zap size={20} />)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedWeek === i ? style.stepColor : 'text-slate-500'}`}>Étape 0{i+1}</span>
                            <span className="text-[10px] font-bold text-slate-400">• {s.duration}</span>
                          </div>
                          <h5 className={`text-lg md:text-xl font-black transition-colors ${selectedWeek === i ? 'text-white' : 'text-slate-300'}`}><GlowText text={s.step} /></h5>
                        </div>
                        <ChevronRight className={`transition-all ${selectedWeek === i ? 'rotate-90 text-orange-400' : 'text-slate-600'}`} size={20} />
                     </button>
                     
                     <AnimatePresence>
                       {selectedWeek === i && (
                         <motion.div 
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: 'auto', opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden"
                         >
                           <div className="p-8 rounded-[30px] bg-white/5 border border-white/5 mx-4 mt-2">
                             <ul className="space-y-4">
                               {s.detailedPlan && s.detailedPlan.map((item, idx) => (
                                 <li key={idx} className="flex gap-4 items-start">
                                   <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(234,88,12,0.8)]" />
                                   <p className="text-sm text-slate-400 leading-relaxed font-light"><GlowText text={item} /></p>
                                 </li>
                               ))}
                             </ul>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 );
               })}

               <div className="mt-8 p-8 rounded-[35px] glass border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent flex flex-col sm:flex-row justify-between items-center gap-8 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
                 <div className="text-center sm:text-left">
                   <p className="text-[9px] uppercase font-black tracking-widest text-orange-500 mb-2">INVESTISSEMENT SACRÉ</p>
                   <div className="flex items-center gap-4 justify-center sm:justify-start">
                     <span className="text-5xl md:text-6xl font-black text-white lumiere-glow">{PROGRAMS[0].price}</span>
                     <div className="flex flex-col items-start leading-none">
                       <span className="text-slate-500 line-through text-sm">290€</span>
                       <span className="text-orange-400 text-[10px] font-black uppercase mt-1 flex items-center gap-1"><Sparkles size={10} /> {PROGRAMS[0].saving}</span>
                     </div>
                   </div>
                 </div>
                 <button 
                  onClick={() => scrollToSection('ritual')}
                  className="w-full sm:w-auto px-10 py-5 rounded-full bg-orange-500 text-white text-[11px] font-black uppercase tracking-widest hover:bg-orange-400 hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
                 >
                   Initier ma <span className="lumiere-glow">Renaissance</span>
                 </button>
               </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section id="faq" className="py-20 bg-slate-950/20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-12"><h2 className="text-3xl font-bold text-white uppercase tracking-tighter">VOS <span className="lumiere-glow">QUESTIONS</span></h2></div>
        <div className="space-y-4">
          {FAQ_DATA.questions.map((q, i) => (
            <div key={i} className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${openIdx === i ? 'border-violet-500/40' : 'border-white/5'}`}>
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full p-6 text-left flex justify-between items-center text-white hover:bg-white/5 transition-colors">
                <span className="text-base font-bold pr-4"><GlowText text={q.q} /></span>
                <ChevronDown className={`transition-transform duration-300 shrink-0 ${openIdx === i ? 'rotate-180 text-violet-400' : ''}`} size={20} />
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="p-6 pt-0 text-slate-400 italic serif-quote text-lg leading-relaxed border-t border-white/5 mt-2">
                      <div className="pt-4">"<GlowText text={q.a} />"</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BooksSection: React.FC<{ onImageClick: (src: string) => void }> = ({ onImageClick }) => (
  <section id="livres" className="py-20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12"><h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">VIBRER PAR <span className="lumiere-glow">LES MOTS</span></h2></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {BOOKS.map((b, i) => (
          <GlassCard key={i} className="p-8 rounded-[35px] flex flex-col sm:flex-row gap-8 group">
            <div 
              className="w-full sm:w-40 h-64 rounded-2xl overflow-hidden shadow-2xl shrink-0 cursor-zoom-in relative"
              onClick={() => onImageClick(b.image)}
            >
              <img src={b.image} alt={b.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest mb-2">{b.tag}</span>
              <h4 className="text-2xl font-black text-white mb-3 tracking-tight leading-tight"><GlowText text={b.title} /></h4>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed"><GlowText text={b.description} /></p>
              <a href={b.url} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-white hover:text-violet-400 transition-colors tracking-widest">
                Découvrir sur Amazon <ExternalLink size={14} />
              </a>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section id="témoignages" className="py-20">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <GlassCard key={i} className="p-10 rounded-[40px] flex flex-col h-full hover:border-violet-500/20 group">
            <QuoteIcon className="text-violet-500/20 mb-8" size={40} />
            <p className="text-lg italic serif-quote text-slate-200 mb-10 flex-1 leading-relaxed">"<GlowText text={t.text} />"</p>
            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
               <img src={t.avatar} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
               <div>
                 <p className="font-bold text-white text-sm">{t.author}</p>
                 <p className="text-[9px] text-violet-400 uppercase font-black tracking-widest">{t.role}</p>
               </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

const RitualContact = () => (
  <section id="ritual" className="py-20 bg-slate-950/50">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <div className="mb-12">
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-violet-400 font-bold mb-4">Posez votre intention</h3>
        <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">INITIER LE <span className="italic font-light">RITUEL</span></h2>
      </div>
      <div className="glass p-8 md:p-20 rounded-[40px] md:rounded-[80px] text-left border border-white/5 shadow-2xl overflow-hidden">
        <p className="text-xl md:text-3xl text-white font-light leading-[1.6]">
          Je m’appelle <input type="text" placeholder="votre nom" className="bg-transparent border-b-2 border-violet-500/30 outline-none w-full sm:w-56 text-violet-400 font-bold placeholder:text-slate-800 focus:border-violet-500 transition-all mb-4" />, <br/>
          mon énergie est <select className="bg-transparent border-b-2 border-violet-500/30 outline-none text-violet-400 font-bold cursor-pointer hover:border-violet-500 transition-all mb-4"><option className="bg-slate-950">fatiguée</option><option className="bg-slate-950">bloquée</option><option className="bg-slate-950">épuisée</option></select> et je souhaite <select className="bg-transparent border-b-2 border-violet-500/30 outline-none text-violet-400 font-bold cursor-pointer hover:border-violet-500 transition-all mb-4"><option className="bg-slate-950">retrouver ma lumière</option><option className="bg-slate-950">libérer mon passé</option><option className="bg-slate-950">guérir mon corps</option></select> avec ton aide, Michael.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-8">
          <button className="group/rit relative px-10 py-5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-violet-600 hover:text-white transition-all duration-500 overflow-hidden w-full sm:w-auto">
            <div className="absolute inset-0 bg-violet-600 translate-y-full group-hover/rit:translate-y-0 transition-transform duration-500"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">Sceller mon <span className="lumiere-glow">Intention</span> <Stars size={18} /></span>
          </button>
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-4">
             <div className="flex -space-x-2">
               {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-8 h-8 rounded-full border-2 border-slate-950" />)}
             </div>
             +21k âmes guidées
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 border-t border-white/5 bg-slate-950/40">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 text-white"><Stars className="text-violet-400" size={24} /><h2 className="text-2xl font-black uppercase tracking-tighter">Michael Furtak</h2></div>
          <p className="text-base text-slate-400 max-w-sm font-light leading-relaxed">
            Maître Praticien <span className="lumiere-glow">Reiki</span> accompagnant l'éveil <span className="lumiere-glow">Starseed</span> et la renaissance des âmes vers leur lumière originelle.
          </p>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase mb-6 text-white tracking-widest">Navigation</h4>
          <ul className="space-y-4">
            {['Éveil', 'Histoire', 'Soins', 'Phoenix', 'Rituel'].map(m => (
              <li key={m}>
                <button onClick={() => scrollToSection(m.toLowerCase())} className="text-xs text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest font-bold">
                  {m}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase mb-6 text-white tracking-widest">Éclosion</h4>
          <form className="flex flex-col gap-3">
            <input type="email" placeholder="Votre email sacré" className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-xs text-white outline-none focus:border-violet-500 transition-all shadow-inner" />
            <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-violet-500/20">
              S'inscrire au Rayon
            </button>
          </form>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] text-slate-700 uppercase tracking-widest font-black italic">
        <div>© {new Date().getFullYear()} Michael Furtak. La Lumière est éternelle.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    <div className="relative selection:bg-violet-600/40 selection:text-white bg-slate-950">
      <CustomCursor />
      <NebulaBackground />
      <Navbar />
      <main>
        <Hero />
        <ManifestoSection />
        <StorySection onImageClick={setLightboxImage} />
        <HistorySection onImageClick={setLightboxImage} />
        <ChakraSystem />
        <PathologiesExplorer onVideoOpen={setActiveVideoUrl} />
        <Services />
        <PhoenixSection onVideoOpen={setActiveVideoUrl} />
        <FAQSection />
        <RitualContact />
        <BooksSection onImageClick={setLightboxImage} />
        <TestimonialsSection />
      </main>
      <QuickNavigation />
      <SoundControl />
      <Footer />

      <AnimatePresence>
        {lightboxImage && (
          <Lightbox 
            src={lightboxImage} 
            onClose={() => setLightboxImage(null)} 
          />
        )}
        {activeVideoUrl && (
          <VideoPlayer 
            url={activeVideoUrl} 
            onClose={() => setActiveVideoUrl(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
