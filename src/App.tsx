import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Services from './components/Services';
import CaseStudy from './components/CaseStudy';
import Carousel from './components/Carousel';
import Philosophy from './components/Philosophy';
import Differentiator from './components/Differentiator';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-accent selection:text-white lg:cursor-none">
      {/* CURSOR PERSONALIZADO PREMIUM */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-accent/50 rounded-full pointer-events-none z-[9999] hidden lg:block"
        animate={{ 
          x: mousePos.x - 20, 
          y: mousePos.y - 20,
          scale: 1
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 150, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-accent rounded-full pointer-events-none z-[9999] hidden lg:block shadow-[0_0_10px_rgba(255,85,0,1)]"
        animate={{ x: mousePos.x - 3, y: mousePos.y - 3 }}
        transition={{ type: 'spring', damping: 10, stiffness: 300, mass: 0.1 }}
      />

      {/* ATMÓSFERA DE FONDO GLOBAL */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.02)_0%,transparent_80%)]" />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Problem />
        <Solution />
        <Services />
        <CaseStudy />
        <Carousel />
        <Philosophy />
        <Differentiator />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}

export default App;
