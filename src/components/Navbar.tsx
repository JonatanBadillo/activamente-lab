import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X, Mail } from 'lucide-react';
import logoSrc from '../images/logo-removebg.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Dynamic values based on scroll
  const navPadding = useTransform(scrollY, [0, 100], ['1.25rem', '0.6rem']);
  const navWidth = useTransform(scrollY, [0, 100], ['100%', '96%']);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    
    // Initial call
    handleResize();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isDesktop = windowWidth >= 768;

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Problema', href: '#problema' },
    { name: 'Solución', href: '#solucion' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Casos', href: '#casos' },
    { name: 'Galería', href: '#galeria' },
    { name: 'Nosotros', href: '#diferenciadores' },
  ];

  return (
    <>
      <motion.header
        style={{ 
          paddingTop: navPadding,
          paddingBottom: navPadding,
          width: navWidth,
          left: '50%',
          x: '-50%'
        }}
        className={`fixed top-0 z-50 transition-all duration-500 ease-out ${
          isScrolled 
            ? 'mt-2 md:mt-4 rounded-full bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <motion.div 
          style={{ width: progressWidth }}
          className="absolute bottom-0 left-10 right-10 h-[1.5px] bg-accent/50 z-50 rounded-full"
        />

        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center gap-4">
            
            <motion.a 
              href="#inicio" 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 group shrink-0 z-50"
            >
              <img src={logoSrc} alt="Activamente Lab Logo" className="h-24 w-auto" />
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                Activamente<span className="text-accent">Lab.</span>
              </span>
            </motion.a>

            {isDesktop && (
              <nav className="flex items-center">
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md relative">
                  {navLinks.map((link) => (
                    <a 
                      key={link.name}
                      href={link.href}
                      onMouseEnter={() => setHoveredPath(link.name)}
                      onMouseLeave={() => setHoveredPath(null)}
                      className="px-4 py-2 text-[12px] lg:text-sm font-black tracking-tighter text-gray-400 hover:text-white transition-colors relative z-10 uppercase italic whitespace-nowrap"
                    >
                      {link.name}
                      {hoveredPath === link.name && (
                        <motion.div
                          layoutId="nav-hover-pill"
                          className="absolute inset-0 bg-accent rounded-xl -z-10 shadow-[0_0_15px_rgba(255,85,0,0.4)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            <div className="flex items-center gap-2 md:gap-4 z-50">
              <motion.a 
                href="#contacto"
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex relative overflow-hidden bg-white text-black font-black py-2.5 px-6 rounded-xl text-sm transition-all items-center gap-2 shadow-xl uppercase italic"
              >
                <span>HABLEMOS</span>
                <ChevronRight className="w-4 h-4" />
                <div className="absolute inset-0 bg-accent translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </motion.a>

              {!isDesktop && (
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-accent hover:border-accent transition-all duration-300"
                >
                  {isMenuOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
                </button>
              )}
            </div>
            
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center p-8 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.05)_0%,transparent_70%)]" />
            
            <nav className="flex flex-col items-center gap-6 md:gap-10 w-full max-w-md relative z-10">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl md:text-6xl font-black text-white hover:text-accent transition-all uppercase italic tracking-tighter w-full text-center flex items-center justify-center gap-6"
                >
                  <span className="text-accent text-sm md:text-xl font-mono drop-shadow-[0_0_10px_rgba(255,85,0,0.5)]">0{index + 1}</span>
                  {link.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-12 w-full"
              >
                <a
                  href="#contacto"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full py-8 bg-white text-black font-black text-2xl rounded-[2rem] flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                  CONTACTAR <Mail className="w-8 h-8" />
                </a>
              </motion.div>
            </nav>
            
            <div className="absolute bottom-10 left-0 w-full text-center text-white/10 text-[10px] font-mono tracking-[1em] uppercase">
              Activamente Lab // Impacto Real
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
