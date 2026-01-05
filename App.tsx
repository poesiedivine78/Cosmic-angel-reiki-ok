
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import NebulaBackground from './components/NebulaBackground';
import Orb from './components/Orb';
import { SERVICES, COLORS, CHAKRAS, PATHOLOGIES, PROGRAMS, BOOKS, SOCIAL_STATS, TESTIMONIALS, MANIFESTO, MY_STORY, FAQ_DATA, REIKI_HISTORY, VIBRATIONAL_QUOTES } from './constants';
import { Sparkles, Star, CheckCircle2, ArrowRight, Send, Facebook, Activity, Moon, Zap, Brain, Heart, Shield, Compass, History, Clock, Info, Stars, ExternalLink, Crown, Check, RefreshCw, Quote as QuoteIcon, ArrowDownCircle, ShieldCheck, Eye, Wind, Layers, Volume2, VolumeX, Menu, X, ChevronRight, HelpCircle, ChevronDown, ScrollText, Sunrise, Lock, LockOpen } from 'lucide-react';

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
  Layers: <Layers size={20} />,
  RefreshCw: <RefreshCw size={20} />
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

    setTimeout(() => {
      audioCtx.close();
    }, 2500);
  } catch (error) {
    console.warn("Audio Context not supported or interaction needed");
  }
};

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const MagneticSection: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 30 }}
    whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const GlassCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
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
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(192, 132, 252, 0.15), transparent 40%)`,
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
    <rect x="49.5" y="52" width="1" height="108" fill="url(#spine-grad)" opacity="0.5" />
    <defs>
      <linearGradient id="spine-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#EF4444" />
      </linearGradient>
    </defs>
  </svg>
);

const SacredGeometry: React.FC<{ className?: string, color?: string }> = ({ className, color = 'currentColor' }) => (
  <svg viewBox="0 0 100 100" className={`absolute opacity-[0.05] pointer-events-none fill-none stroke-current ${className}`} strokeWidth="0.15" style={{ color }}>
    <circle cx="50" cy="50" r="45" />
    <circle cx="50" cy="50" r="30" />
    <path d="M50 5 L95 95 L5 95 Z" />
    <path d="M50 95 L95 5 L5 5 Z" />
    <rect x="20" y="20" width="60" height="60" />
  </svg>
);

const FloatingMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { name: 'Éveil', id: 'éveil' },
    { name: 'Histoire', id: 'histoire' },
    { name: 'Sagesse', id: 'wisdom' },
    { name: 'Énergie', id: 'chakra-system' },
    { name: 'Diagnostic', id: 'quand-consulter' },
    { name: 'Soins Reiki', id: 'soin' },
    { name: 'Phoenix', id: 'phoenix' },
    { name: 'Rituel', id: 'ritual' },
    { name: 'Livres', id: 'livres' },
    { name: 'FAQ', id: 'faq' }
  ];

  return (
    <div className="fixed bottom-8 left-8 z-[200]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 left-0 glass p-4 rounded-3xl border border-white/10 shadow-2xl min-w-[200px]"
          >
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-violet-400 mb-2 px-2">Navigation Rapide</p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all group"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-violet-600 transition-all shadow-xl shadow-violet-500/10"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </div>
  );
};

const ReikiHistorySection = () => (
  <section id="wisdom" className="py-24 relative overflow-hidden bg-slate-950/40">
    <div className="container mx-auto px-6">
      <MagneticSection>
        <div className="text-center mb-20">
          <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">{REIKI_HISTORY.subtitle}</h3>
          <h2 className="text-4xl md:text-6xl font-black text-white vibratory-heading uppercase tracking-tighter mb-8">{REIKI_HISTORY.title}</h2>
          <p className="text-slate-400 italic serif-quote text-lg max-w-2xl mx-auto">{REIKI_HISTORY.intro}</p>
        </div>
      </MagneticSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
        {REIKI_HISTORY.history.map((item, idx) => (
          <MagneticSection key={idx} delay={idx * 0.2}>
            <GlassCard className="p-8 md:p-12 rounded-[40px] border border-white/10 group overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 aspect-square rounded-3xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-500 mb-2 block">{item.period}</span>
                  <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{item.text}</p>
                </div>
              </div>
            </GlassCard>
          </MagneticSection>
        ))}
      </div>

      <MagneticSection>
        <div className="text-center mb-16">
          <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">{REIKI_HISTORY.preceptsTitle}</h3>
          <p className="text-slate-500 text-sm uppercase tracking-widest">{REIKI_HISTORY.preceptsSubtitle}</p>
        </div>
      </MagneticSection>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {REIKI_HISTORY.precepts.map((p, idx) => (
          <MagneticSection key={idx} delay={idx * 0.1}>
            <GlassCard className="p-8 rounded-[32px] border border-white/5 group h-full hover:border-violet-500/40 transition-all">
              <div className="text-center">
                <span className="text-3xl font-black text-violet-900/40 block mb-4 group-hover:text-violet-500 transition-colors">{p.id}</span>
                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-2">{p.ja}</p>
                <h5 className="text-sm md:text-base font-bold text-white mb-4 leading-tight">{p.fr}</h5>
                <div className="w-8 h-px bg-white/10 mx-auto mb-4 group-hover:w-16 group-hover:bg-violet-500 transition-all"></div>
                <p className="text-[10px] text-slate-500 italic uppercase tracking-wider">{p.detail}</p>
              </div>
            </GlassCard>
          </MagneticSection>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-slate-950/20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] -z-10"></div>
      <div className="container mx-auto px-6 max-w-4xl">
        <MagneticSection>
          <div className="text-center mb-16">
            <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">{FAQ_DATA.title}</h3>
            <h2 className="text-4xl md:text-5xl font-black text-white vibratory-heading uppercase tracking-tighter mb-8">{FAQ_DATA.subtitle}</h2>
            <p className="text-slate-400 italic serif-quote text-lg max-w-2xl mx-auto">{FAQ_DATA.intro}</p>
          </div>
        </MagneticSection>

        <div className="space-y-4">
          {FAQ_DATA.questions.map((item, idx) => (
            <MagneticSection key={idx} delay={idx * 0.05}>
              <div 
                className={`glass rounded-3xl border border-white/10 transition-all duration-500 overflow-hidden cursor-pointer ${openIndex === idx ? 'bg-white/5 border-violet-500/30' : 'hover:bg-white/5'}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="p-6 md:p-8 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <HelpCircle className={`shrink-0 transition-colors duration-500 ${openIndex === idx ? 'text-violet-400' : 'text-slate-600'}`} size={20} />
                    <h4 className="text-sm md:text-base font-bold text-white uppercase tracking-wider">{item.q}</h4>
                  </div>
                  <ChevronDown className={`shrink-0 transition-transform duration-500 ${openIndex === idx ? 'rotate-180 text-violet-400' : 'text-slate-600'}`} size={20} />
                </div>
                
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 md:px-8 pb-8 pt-2 border-t border-white/5">
                        <p className="text-slate-400 leading-relaxed text-sm md:text-base italic serif-quote">
                          "{item.a}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </MagneticSection>
          ))}
        </div>
        
        <MagneticSection delay={0.4}>
          <div className="mt-16 text-center">
            <button 
              onClick={() => scrollToSection('ritual')}
              className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all"
            >
              Plus d'informations ? Contactez-moi
            </button>
          </div>
        </MagneticSection>
      </div>
    </section>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'py-3 glass border-b' : 'py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Stars className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest uppercase text-white">Michael Furtak</h1>
            <p className="text-[10px] text-violet-400 font-medium tracking-[0.2em] uppercase">Starseed Cosmic Angel</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: 'Éveil', id: 'éveil' },
            { name: 'Histoire', id: 'histoire' },
            { name: 'Soins', id: 'soin' },
            { name: 'Phoenix', id: 'phoenix' },
            { name: 'Livres', id: 'livres' }
          ].map((item) => (
            <button key={item.name} onClick={() => scrollToSection(item.id)} className="text-[10px] uppercase tracking-widest font-bold text-white/70 hover:text-violet-400 transition-colors">
              {item.name}
            </button>
          ))}
          <button onClick={() => scrollToSection('ritual')} className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all duration-300 shadow-lg shadow-white/10">
            Poser une Intention
          </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ 
      x: (e.clientX / window.innerWidth - 0.5) * 40, 
      y: (e.clientY / window.innerHeight - 0.5) * 40 
    });
  };

  return (
    <section id="éveil" onMouseMove={handleMouseMove} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 transition-transform duration-300 ease-out pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(139,92,246,1) 0%, rgba(59,130,246,1) 100%)',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <MagneticSection>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 animate-bounce-slow">
            <Sparkles size={16} className="text-violet-400" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">L'expérience vibratoire commence ici</span>
          </div>

          <h1 className="text-xl md:text-3xl font-black mb-2 tracking-[0.4em] uppercase text-violet-400 lumiere-glow">
            Starseed Cosmic Angel
          </h1>
          
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] text-white vibratory-heading">
            TRANSFORMER <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-violet-600">L'OMBRE</span> EN <span className="lumiere-glow">LUMIÈRE</span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 serif-quote italic mb-12">
            "Réveillez la force stellaire qui sommeille en vous. Par le Reiki Usui & Kundalini, retrouvez l'harmonie parfaite de votre structure d'âme."
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => scrollToSection('quand-consulter')} 
              className="w-full md:w-auto px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:scale-105 transition-transform animate-impulse text-center text-white"
            >
              Explorer mes soins
            </button>
            <button 
              onClick={() => scrollToSection('livres')} 
              className="w-full md:w-auto px-10 py-5 rounded-full glass border border-white/10 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-colors text-center text-white"
            >
              Boutique Amazon
            </button>
          </div>
        </MagneticSection>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer" onClick={() => scrollToSection('manifeste')}>
        <ArrowDownCircle className="text-white/20 hover:text-white/50 transition-colors" size={32} />
      </div>
    </section>
  );
};

const ManifestoSection = () => (
  <section id="manifeste" className="py-24 relative overflow-hidden bg-slate-950/20">
    <div className="container mx-auto px-6 max-w-4xl text-center">
      <MagneticSection>
        <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-8">{MANIFESTO.title}</h3>
        <div className="relative">
          <QuoteIcon className="absolute -top-10 -left-6 text-violet-500/10 w-24 h-24" />
          <div className="glass p-12 md:p-16 rounded-[40px] border border-white/5 relative z-10 overflow-hidden group">
            <div className="absolute -inset-full bg-gradient-to-br from-violet-600/5 via-transparent to-blue-600/5 group-hover:animate-pulse pointer-events-none"></div>
            <p className="text-xl md:text-3xl text-slate-200 leading-[1.6] serif-quote italic text-center">
              {MANIFESTO.text}
            </p>
          </div>
          <QuoteIcon className="absolute -bottom-10 -right-6 text-violet-500/10 w-24 h-24 rotate-180" />
        </div>
      </MagneticSection>
    </div>
  </section>
);

const StorySection = () => (
  <section id="histoire" className="py-32 relative overflow-hidden">
    <div className="container mx-auto px-6">
      <MagneticSection>
        <div className="text-center mb-24">
          <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">{MY_STORY.subtitle}</h3>
          <h2 className="text-5xl md:text-7xl font-black text-white vibratory-heading uppercase tracking-tighter">{MY_STORY.title}</h2>
        </div>
      </MagneticSection>

      <div className="space-y-32">
        {MY_STORY.chapters.map((chapter, idx) => (
          <MagneticSection key={chapter.id}>
            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
              <div className="w-full lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-blue-600/20 blur-2xl rounded-[40px] -z-10 animate-pulse"></div>
                <div className="rounded-[40px] overflow-hidden aspect-[4/5] md:aspect-square relative group shadow-2xl">
                  <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-8 left-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-violet-600 px-4 py-2 rounded-full text-white">{chapter.tag}</span>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/2 text-left">
                <h4 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center gap-4">
                  <span className="text-violet-500 font-black">0{idx + 1}.</span> {chapter.title}
                </h4>
                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
                    {chapter.content}
                  </p>
                  {chapter.quote && (
                    <div className="p-8 border-l-4 border-violet-500 bg-white/5 rounded-r-3xl my-8">
                      <p className="serif-quote italic text-2xl md:text-3xl text-white/90">
                        "{chapter.quote}"
                      </p>
                    </div>
                  )}
                </div>
                {idx === MY_STORY.chapters.length - 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12">
                    {MY_STORY.synchronicity.map((sync, sidx) => (
                      <div key={sidx} className="glass p-6 rounded-3xl border border-white/10 group hover:border-violet-500/50 transition-all hover:-translate-y-2">
                        <h5 className="text-violet-400 font-bold uppercase tracking-widest text-[10px] mb-2">{sync.title}</h5>
                        <p className="text-[10px] text-slate-500 italic leading-relaxed">{sync.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </MagneticSection>
        ))}
      </div>
    </div>
  </section>
);

const PathologiesExplorer = () => {
  const [activeTab, setActiveTab] = useState<'physique' | 'psychique' | 'spirituel'>('physique');

  return (
    <section id="quand-consulter" className="py-24 bg-slate-950/30">
      <div className="container mx-auto px-6">
        <MagneticSection>
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-xl">
              <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">Diagnostic Fréquentiel</h3>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white vibratory-heading">QUAND <span className="italic font-light">CONSULTER ?</span></h2>
              <p className="text-slate-400 mt-4">Identifiez votre besoin pour découvrir l'approche thérapeutique la plus adaptée à votre structure énergétique.</p>
            </div>
            <div className="flex gap-4 p-1 glass rounded-2xl border border-white/5">
              {['physique', 'psychique', 'spirituel'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-violet-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </MagneticSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PATHOLOGIES[activeTab].map((p, idx) => (
            <MagneticSection key={idx} delay={idx * 0.1}>
              <GlassCard className="p-8 rounded-[32px] group flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    {iconsMap[p.icon] || <Activity />}
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] uppercase font-black tracking-widest text-slate-500 block mb-1">Recommandation</span>
                    <span className="text-[10px] font-bold text-violet-400">{p.details.recommendation}</span>
                  </div>
                </div>
                
                <h4 className="text-2xl font-bold mb-2 text-white">{p.title}</h4>
                <p className="text-[10px] text-violet-300 font-black mb-6 uppercase tracking-widest">Reiki {p.reiki}</p>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <h5 className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <Info size={12} /> Origine possible
                    </h5>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "{p.details.origin}"
                    </p>
                  </div>

                  <div>
                    <h5 className="text-[9px] uppercase font-black tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={12} /> Bienfaits apportés
                    </h5>
                    <ul className="space-y-2">
                      {p.details.benefits.map((benefit, i) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-violet-500"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5 mt-auto">
                    <div className="flex justify-between text-[8px] uppercase font-bold tracking-widest mb-2 text-slate-500">
                      <span>Intensité de l'accompagnement</span>
                      <span className="text-violet-400">{activeTab === 'physique' ? p.impact.physical : activeTab === 'psychique' ? p.impact.emotional : p.impact.spiritual}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-violet-600 to-blue-600 transition-all duration-1000" 
                        style={{ width: `${activeTab === 'physique' ? p.impact.physical : activeTab === 'psychique' ? p.impact.emotional : p.impact.spiritual}%` }}
                      ></div>
                    </div>
                  </div>

                  <button 
                    onClick={() => scrollToSection('soin')}
                    className="w-full py-4 bg-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all rounded-2xl flex items-center justify-center gap-2 border border-white/10"
                  >
                    Découvrir ce soin <ArrowRight size={14} />
                  </button>
                </div>
              </GlassCard>
            </MagneticSection>
          ))}
        </div>
      </div>
    </section>
  );
};

const RitualContact = () => {
  const [formData, setFormData] = useState({ name: '', energy: 'fatigué(e)', goal: 'retrouver ma lumière' });

  return (
    <section id="ritual" className="py-24 relative overflow-hidden bg-slate-950/50">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <MagneticSection>
          <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">Posez votre intention</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16 vibratory-heading">INITIER LE <span className="italic font-light">RITUEL</span></h2>
          
          <div className="glass p-12 md:p-20 rounded-[60px] border border-white/10 text-left">
            <p className="text-xl md:text-3xl text-white leading-relaxed md:leading-[1.8] font-light">
              Je m’appelle <input 
                type="text" 
                placeholder="votre nom" 
                className="bg-transparent border-b border-violet-500/50 focus:border-violet-500 outline-none px-2 w-48 text-violet-400 placeholder:text-violet-900/50" 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />, <br className="hidden md:block"/>
              en ce moment je sens que mon énergie est <select 
                className="bg-transparent border-b border-violet-500/50 focus:border-violet-500 outline-none text-violet-400 cursor-pointer"
                onChange={(e) => setFormData({...formData, energy: e.target.value})}
              >
                <option value="fatigué(e)">fatiguée</option>
                <option value="bloquée">bloquée</option>
                <option value="en quête">en quête de sens</option>
                <option value="épuisée">épuisée</option>
              </select> et je souhaite <select 
                className="bg-transparent border-b border-violet-500/50 focus:border-violet-500 outline-none text-violet-400 cursor-pointer"
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
              >
                <option value="retrouver ma lumière">retrouver ma lumière</option>
                <option value="libérer mon passé">libérer mon passé</option>
                <option value="découvrir mes codes">découvrir mes codes</option>
                <option value="guérir mon corps">guérir mon corps</option>
              </select> avec ton aide, Michael.
            </p>
            
            <div className="mt-16 flex flex-col md:flex-row items-center gap-8">
              <button className="w-full md:w-auto px-10 py-5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-violet-400 hover:text-white transition-all">
                Sceller mon intention
              </button>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Réponse vibratoire sous 24h</p>
            </div>
          </div>
        </MagneticSection>
      </div>
    </section>
  );
};

const ConstellationNav = () => {
  const sections = useMemo(() => [
    { id: 'éveil', name: 'Éveil' },
    { id: 'manifeste', name: 'Manifeste' },
    { id: 'histoire', name: 'Histoire' },
    { id: 'wisdom', name: 'Sagesse' },
    { id: 'chakra-system', name: 'Énergie' },
    { id: 'quand-consulter', name: 'Diagnostic' },
    { id: 'soin', name: 'Soins' },
    { id: 'phoenix', name: 'Phoenix' },
    { id: 'ritual', name: 'Rituel' },
    { id: 'livres', name: 'Livres' },
    { id: 'faq', name: 'FAQ' },
    { id: 'témoignages', name: 'Échos' }
  ], []);

  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const [activeSection, setActiveSection] = useState('éveil');

  useEffect(() => {
    const observers = sections.map(section => {
      const el = document.getElementById(section.id);
      if (!el) return null;
      
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActiveSection(section.id);
      }, { threshold: 0.5 });
      
      observer.observe(el);
      return observer;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, [sections]);

  return (
    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[90] hidden lg:block h-[60vh] w-12">
      <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 800" fill="none">
        <motion.path
          d="M50 0 L50 800"
          stroke="rgba(192, 132, 252, 0.1)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <motion.path
          d="M50 0 L50 800"
          stroke="#C084FC"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>

      <div className="flex flex-col justify-between h-full relative">
        {sections.map((section, i) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center justify-center w-full"
            >
              <div 
                className={`w-3 h-3 rounded-full transition-all duration-700 relative z-10 
                  ${isActive ? 'scale-150 animate-supernova' : 'scale-100 opacity-40 group-hover:opacity-100'}`}
                style={{ 
                  backgroundColor: isActive ? '#C084FC' : 'white',
                  color: '#C084FC'
                }}
              >
                {isActive && (
                   <div className="absolute inset-0 bg-violet-400 rounded-full blur-[8px] animate-pulse"></div>
                )}
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-full mr-6 px-3 py-1.5 glass rounded-lg border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white whitespace-nowrap shadow-xl"
                  >
                    {section.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AudioToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
      audioRef.current.volume = 0.05;
      audioRef.current.loop = true;
    }
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked"));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={toggle}
      className="fixed bottom-8 right-8 z-[100] w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
    >
      {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} className="opacity-50" />}
      <span className="absolute right-full mr-4 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] uppercase font-black tracking-widest whitespace-nowrap bg-black/50 px-2 py-1 rounded">
        Vibration 528 Hz
      </span>
    </button>
  );
};

const Services = () => (
  <section id="soin" className="py-24">
    <div className="container mx-auto px-6">
      <MagneticSection>
        <div className="text-center mb-20">
          <h3 className="text-xs uppercase tracking-[0.5em] text-blue-400 font-bold mb-4">Méthodes de Guérison</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white vibratory-heading">NOS <span className="italic font-light">SOINS</span> STELLAIRES</h2>
        </div>
      </MagneticSection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {SERVICES.map((service, idx) => (
          <MagneticSection key={idx} delay={idx * 0.1}>
            <GlassCard className="p-10 rounded-[40px] border border-white/10 group h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block text-white`} style={{ backgroundColor: `${service.color}40` }}>
                    Reiki {service.type}
                  </span>
                  <h4 className="text-3xl font-bold mb-2 text-white">{service.title}</h4>
                  <p className="text-violet-400 font-medium">{service.subtitle}</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black mb-1 text-white">{service.price}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
                    <Clock size={14} />
                    {service.duration}
                  </div>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 flex-1">
                {Object.entries(service.detailedBenefits).map(([key, benefits]) => (
                  <div key={key}>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-4">{key}</p>
                    <ul className="space-y-3">
                      {benefits.map((b, i) => (
                        <li key={i} className="text-[11px] flex items-start gap-2 text-slate-300">
                          <Check size={14} className="text-violet-400 shrink-0 mt-0.5" />
                          <span><strong>{b.label}:</strong> {b.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <a href={service.url} target="_blank" rel="noopener noreferrer" className="block w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-all duration-500 text-center text-white mt-auto">
                Réserver ce soin
              </a>
            </GlassCard>
          </MagneticSection>
        ))}
      </div>
    </div>
  </section>
);

const PhoenixProtocol = () => (
  <section id="phoenix" className="py-24 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[150px] -z-10"></div>
    <div className="container mx-auto px-6">
      <MagneticSection>
        <GlassCard className="rounded-[60px] p-12 md:p-24 border border-white/10 overflow-hidden">
          <div className="absolute top-10 right-10">
            <ShieldCheck size={120} className="text-violet-500/10" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-white">
                <Crown size={14} /> EXCLUSIVITÉ SIGNATURE
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-white vibratory-heading">LE PROTOCOLE <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">PHOENIX</span></h2>
              <p className="text-xl text-slate-400 serif-quote italic mb-12">
                "Brûlez les anciennes versions de vous-même pour renaître dans votre vibration originelle la plus pure."
              </p>
              
              <div className="space-y-6 mb-12">
                {PROGRAMS[0].perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-orange-500" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm uppercase tracking-widest text-white">{perk.label}</h5>
                      <p className="text-sm text-slate-500">{perk.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6">
                <div className="px-8 py-4 rounded-3xl bg-white text-black font-black text-2xl">
                  {PROGRAMS[0].price}
                </div>
                <div className="text-sm font-bold text-orange-400 uppercase tracking-widest">
                  {PROGRAMS[0].saving}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 mb-8">Le Voyage de Transformation</h4>
              {PROGRAMS[0].path.map((step, i) => (
                <div key={i} className="relative glass p-6 rounded-3xl border border-white/5 flex gap-6 items-center group hover:bg-white/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 text-orange-400 group-hover:scale-110 transition-transform">
                    {iconsMap[step.icon] || <Zap />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="font-bold text-lg text-white">{step.step}</h5>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{step.duration}</span>
                    </div>
                    <p className="text-xs text-slate-400">{step.desc}</p>
                  </div>
                  {i < PROGRAMS[0].path.length - 1 && (
                    <div className="absolute left-[34px] -bottom-4 w-px h-4 bg-white/10"></div>
                  )}
                </div>
              ))}
              <a href="https://starseedcosmicangel.setmore.com/michael" target="_blank" rel="noopener noreferrer" className="block w-full mt-8 py-6 rounded-[30px] bg-gradient-to-r from-orange-600 to-red-600 text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-red-600/20 hover:scale-[1.02] transition-transform text-center text-white">
                Initier ma renaissance
              </a>
            </div>
          </div>
        </GlassCard>
      </MagneticSection>
    </div>
  </section>
);

const Books = () => (
  <section id="livres" className="py-24">
    <div className="container mx-auto px-6 text-center">
      <MagneticSection>
        <div className="text-center mb-20">
          <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">Mots Vibratoires</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white vibratory-heading">VIBRER PAR <span className="italic font-light">LES MOTS</span></h2>
        </div>
      </MagneticSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {BOOKS.map((book, idx) => (
          <MagneticSection key={idx} delay={idx * 0.1}>
            <GlassCard className="rounded-[40px] p-8 flex flex-col lg:flex-row gap-8 text-left">
              <div className="w-full lg:w-48 h-72 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 mb-2">{book.tag}</span>
                <h4 className="text-2xl font-bold mb-1 text-white">{book.title}</h4>
                <p className="text-sm font-medium text-slate-500 mb-4">{book.subtitle}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-8">{book.description}</p>
                <a 
                  href={book.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-violet-400 transition-colors"
                >
                  Découvrir sur Amazon <ExternalLink size={14} />
                </a>
              </div>
            </GlassCard>
          </MagneticSection>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section id="témoignages" className="py-24 bg-slate-950/20">
    <div className="container mx-auto px-6">
      <MagneticSection>
        <div className="text-center mb-20">
          <h3 className="text-xs uppercase tracking-[0.5em] text-green-400 font-bold mb-4">Voix de la Communauté</h3>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white vibratory-heading">ILS ONT <span className="italic font-light">RETROUVÉ LEUR LUMIÈRE</span></h2>
        </div>
      </MagneticSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, i) => (
          <MagneticSection key={i} delay={i * 0.1}>
            <GlassCard className="p-10 rounded-[40px] flex flex-col h-full">
              <QuoteIcon className="text-violet-500/30 mb-8" size={40} />
              <p className="text-lg italic serif-quote text-slate-300 leading-relaxed mb-8 flex-1">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full border border-violet-500/30" />
                <div>
                  <p className="font-bold text-sm text-white">{t.author}</p>
                  <p className="text-[10px] uppercase tracking-widest text-violet-400">{t.role}</p>
                </div>
              </div>
            </GlassCard>
          </MagneticSection>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 border-t border-white/5 relative overflow-hidden">
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[300px] bg-violet-600/5 rounded-full blur-[100px] -z-10"></div>
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
        <MagneticSection>
          <div>
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Stars className="text-black" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Michael Furtak</h2>
                <p className="text-[10px] text-violet-400 font-bold tracking-[0.3em] uppercase">Starseed Cosmic Angel</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-sm">
              Maître Praticien Reiki spécialisé dans l'éveil Starseed et la transmutation des mémoires cellulaires. Guide vers votre souveraineté fréquentielle.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-violet-600 transition-colors text-white">
                <Facebook size={18} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-violet-600 transition-colors text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>
        </MagneticSection>

        <MagneticSection delay={0.1}>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white">Navigation Rapide</h4>
            <ul className="space-y-4">
              {[
                { name: 'Quand consulter ?', id: 'quand-consulter' },
                { name: 'Soins Reiki', id: 'soin' },
                { name: 'Protocole Phoenix', id: 'phoenix' },
                { name: 'Livres & Poésies', id: 'livres' },
                { name: 'Témoignages', id: 'témoignages' }
              ].map(item => (
                <li key={item.name}>
                  <button onClick={() => scrollToSection(item.id)} className="text-xs text-slate-400 hover:text-white transition-colors text-left">{item.name}</button>
                </li>
              ))}
            </ul>
          </div>
        </MagneticSection>

        <MagneticSection delay={0.2}>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white">Newsletter Fréquentielle</h4>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Recevez mes guidances mensuelles et les codes d'activation stellaire directement dans votre boîte mail.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Votre email sacré" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xs focus:outline-none focus:border-violet-600 transition-colors text-white" />
              <button className="p-4 rounded-2xl bg-white text-black hover:bg-violet-600 hover:text-white transition-colors" type="submit">
                <Send size={18} />
              </button>
            </form>
          </div>
        </MagneticSection>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-[9px] text-slate-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Michael Furtak. Tous droits réservés.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[9px] text-slate-600 uppercase tracking-widest hover:text-white">Mentions Légales</a>
          <a href="#" className="text-[9px] text-slate-600 uppercase tracking-widest hover:text-white">Confidentialité</a>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="relative selection:bg-violet-500/30 selection:text-white">
      <CustomCursor />
      <NebulaBackground />
      <ConstellationNav />
      <FloatingMenu />
      <AudioToggle />
      <Navbar />
      
      <main>
        <Hero />
        <ManifestoSection />
        <StorySection />
        <ReikiHistorySection />
        <ChakraSystem />
        <PathologiesExplorer />
        <Services />
        <PhoenixProtocol />
        <FAQSection />
        <RitualContact />
        <Books />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
};

const ChakraSystem = () => {
  const [randomQuote, setRandomQuote] = useState("");
  const [activeChakra, setActiveChakra] = useState(CHAKRAS[0]);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * VIBRATIONAL_QUOTES.length);
    setRandomQuote(VIBRATIONAL_QUOTES[randomIndex]);
  }, []);

  const handleChakraClick = (chakra: any) => {
    setActiveChakra(chakra);
    playChakraSound(chakra.frequency);
    
    // Défilement automatique vers le texte si on est sur mobile
    if (window.innerWidth < 1024 && textRef.current) {
        textRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="chakra-system" className="py-24 relative overflow-hidden bg-slate-950/50">
      <SacredGeometry className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] text-violet-500" />
      <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
        <MagneticSection>
          <div className="text-center mb-16">
            <h3 className="text-xs uppercase tracking-[0.5em] text-violet-400 font-bold mb-4">Ingénierie Sacrée</h3>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white vibratory-heading uppercase">L'État des <span className="italic font-light">CHAKRAS</span></h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto uppercase text-[10px] tracking-widest font-black">Cliquez sur un centre pour explorer son état de conscience</p>
          </div>
        </MagneticSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Section Silhouette */}
          <div className="lg:col-span-4 relative h-[650px] flex items-center justify-center">
            <BodySilhouette className="w-full h-full opacity-30" />
            {CHAKRAS.map((chakra, idx) => (
              <div key={idx} className={`absolute left-1/2 -translate-x-1/2 ${chakra.pos}`}>
                <Orb 
                  color={chakra.color} 
                  size={activeChakra.id === chakra.id ? "55px" : "40px"}
                  interactive={true} 
                  label={chakra.name} 
                  description={`${chakra.frequency} - ${chakra.meaning}`} 
                  onClick={() => handleChakraClick(chakra)}
                />
                {activeChakra.id === chakra.id && (
                  <motion.div 
                    layoutId="active-ring"
                    className="absolute inset-[-10px] rounded-full border border-white/20 animate-ping"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Section Diagnostic Détaillé (Image Integration) */}
          <div ref={textRef} className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BLOQUÉ */}
              <MagneticSection delay={0.1}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-3xl blur opacity-25 transition duration-1000 group-hover:opacity-50"></div>
                  <GlassCard className="p-8 rounded-3xl relative border-red-500/20">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500">
                        <Lock size={24} />
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white">BLOQUÉ</h4>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeChakra.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <p className="text-red-400 font-bold text-sm uppercase tracking-widest">Symptômes de densité :</p>
                        <p className="text-slate-300 leading-relaxed text-lg italic serif-quote">
                          "{activeChakra.blocked}"
                        </p>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">L'énergie stagne et crée des résistances dans votre quotidien.</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </GlassCard>
                </div>
              </MagneticSection>

              {/* OUVERT */}
              <MagneticSection delay={0.2}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-3xl blur opacity-25 transition duration-1000 group-hover:opacity-100"></div>
                  <GlassCard className="p-8 rounded-3xl relative border-green-500/20">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400">
                        <LockOpen size={24} />
                      </div>
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-white">OUVERT</h4>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeChakra.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-4"
                      >
                        <p className="text-green-400 font-bold text-sm uppercase tracking-widest">Fréquence de Lumière :</p>
                        <p className="text-slate-100 leading-relaxed text-lg italic serif-quote font-medium">
                          "{activeChakra.open}"
                        </p>
                        <div className="pt-4 border-t border-white/5">
                           <p className="text-[10px] text-slate-500 uppercase tracking-widest">L'énergie circule librement, vous incarnant pleinement.</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </GlassCard>
                </div>
              </MagneticSection>
            </div>

            {/* Quote of the day context */}
            <MagneticSection delay={0.3}>
              <div className="p-px rounded-3xl bg-gradient-to-r from-violet-500/20 to-blue-500/20">
                <div className="glass p-8 rounded-[calc(1.5rem-1px)]">
                  <div className="flex justify-between items-start mb-4">
                    <QuoteIcon className="text-violet-400 opacity-50" size={32} />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-violet-400/50">Mantra d'activation</span>
                  </div>
                  <p className="serif-quote text-xl italic text-white/80 leading-relaxed">
                    "{randomQuote || VIBRATIONAL_QUOTES[0]}"
                  </p>
                </div>
              </div>
            </MagneticSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
