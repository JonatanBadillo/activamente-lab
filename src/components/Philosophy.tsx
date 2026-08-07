import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Quote } from 'lucide-react';

const Philosophy = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section 
      id="filosofia" 
      ref={containerRef}
      className="relative py-32 md:py-64 bg-accent overflow-hidden"
    >
      {/* 1. FONDO CON MOVIMIENTO MASIVO (PARALLAX) */}
      <motion.div 
        style={{ y: textY }}
        className="absolute inset-0 flex items-center justify-center opacity-[0.1] select-none pointer-events-none"
      >
        <span className="text-[30vw] font-black uppercase italic tracking-tighter text-black whitespace-nowrap">
          EXPERIENCIA • MEMORIA • IMPACTO
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Manifiesto Central */}
          <motion.div 
            style={{ opacity }}
            className="flex flex-col items-center text-center text-white"
          >
            {/* Icono de Cita de Lujo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 p-5 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl"
            >
              <Quote className="w-10 h-10 md:w-16 md:h-16 text-black fill-black" />
            </motion.div>

            {/* Título Monumental - Corregido para Visibilidad Máxima */}
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-12 leading-[0.8] tracking-tighter uppercase italic">
              NO HACEMOS <br />
              <span className="text-black drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]">ANUNCIOS.</span>
            </h2>

            {/* Línea Divisoria de Diseño */}
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 160 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-3 bg-black mb-16 rounded-full" 
            />

            {/* Cuerpo del Manifiesto con Resaltado */}
            <p className="text-2xl md:text-4xl lg:text-5xl font-black leading-[1.1] max-w-5xl tracking-tight uppercase">
              Creamos <span className="bg-white text-black px-6 py-2 italic rounded-2xl shadow-xl inline-block my-2">IMPACTO.</span> <br />
              Cada activación está diseñada para que las personas participen, sientan y <span className="text-black/70">recuerden.</span>
            </p>

            {/* Cierre de Impacto con Animación de Entrada */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-20 pt-10 border-t-4 border-white/20"
            >
              <span className="text-black font-black text-xl md:text-4xl uppercase tracking-[0.1em] italic">
                Porque cuando una marca se vive, se queda.
              </span>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* 2. EFECTOS ATMOSFÉRICOS */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent opacity-40" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent opacity-40" />
      
      {/* Micro-destellos decorativos */}
      <div className="absolute top-1/4 left-10 w-2 h-2 bg-white rounded-full animate-ping opacity-30" />
      <div className="absolute bottom-1/4 right-10 w-2 h-2 bg-white rounded-full animate-ping opacity-30" />
    </section>
  );
};

export default Philosophy;
