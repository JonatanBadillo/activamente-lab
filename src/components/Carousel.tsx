import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  Image as ImageIcon, 
  Sparkles,
  Play,
  Pause
} from 'lucide-react';

// Use Vite's import.meta.glob to dynamically discover all images under src/images/carrusel
const imagesGlob = import.meta.glob('../images/carrusel/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });

interface ImageItem {
  src: string;
  originalPath: string;
}

// Parse and categorize images outside the component so it's only done once on module load
const categorizedImages: Record<string, ImageItem[]> = {};

Object.entries(imagesGlob).forEach(([path, module]) => {
  const src = (module as { default: string }).default;
  // Get part after '../images/carrusel/'
  const relativePath = path.replace('../images/carrusel/', '');
  const parts = relativePath.split('/');
  
  if (parts.length === 1) {
    // Direct child of carrusel/ is considered an Event image
    const category = 'Eventos';
    if (!categorizedImages[category]) {
      categorizedImages[category] = [];
    }
    categorizedImages[category].push({ src, originalPath: path });
  } else if (parts.length > 1) {
    // Child of a subfolder, e.g. "Edecan 1"
    const category = parts[0];
    if (!categorizedImages[category]) {
      categorizedImages[category] = [];
    }
    categorizedImages[category].push({ src, originalPath: path });
  }
});

// Create a mapping of Edecan categories to their first image (avatar)
const categoryAvatars: Record<string, string> = {};
Object.entries(categorizedImages).forEach(([category, images]) => {
  if (category.startsWith('Edecan') && images.length > 0) {
    categoryAvatars[category] = images[0].src;
  }
});

// Sort categories. "Eventos" first, then Edecan 1, Edecan 2, ..., Edecan 10 in numeric order.
const sortedCategories = Object.keys(categorizedImages).sort((a, b) => {
  if (a === 'Eventos') return -1;
  if (b === 'Eventos') return 1;
  
  // Extract trailing numeric value for edecanes
  const numA = parseInt(a.replace(/^\D+/g, ''), 10) || 0;
  const numB = parseInt(b.replace(/^\D+/g, ''), 10) || 0;
  
  return numA - numB;
});

const Carousel = () => {
  const [activeCategory, setActiveCategory] = useState<string>('Eventos');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeImages = useMemo(() => {
    return categorizedImages[activeCategory] || [];
  }, [activeCategory]);

  // Reset scroll and lightbox index when switching categories
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoplay || lightboxIndex !== null || activeImages.length === 0) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const container = carouselRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          // Wrap around to start smoothly
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll forward by one card size (roughly 340px with margin)
          container.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoplay, lightboxIndex, activeImages]);

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeImages]);

  const handleNextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < activeImages.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : activeImages.length - 1));
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="galeria" 
      className="relative py-24 md:py-48 bg-[#030303] overflow-hidden border-t border-b border-white/5"
    >
      {/* BACKGROUND DECORATIONS & KINETIC BLUR */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-accent rounded-full blur-[160px]" 
        />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.015)_0%,transparent_75%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-8">
              <ImageIcon className="w-6 h-6 text-accent animate-pulse" />
              <span className="text-accent font-black tracking-[0.5em] uppercase text-xs">Galería de Impacto</span>
            </div>

            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
              REGISTROS QUE <br /> 
              <span className="text-accent drop-shadow-[0_0_30px_rgba(204,255,0,0.4)]">DEJAN HUELLA.</span>
            </h2>
          </div>

          {/* CONTROLS (AUTOPLAY TOGGLE & PREV/NEXT) */}
          <div className="flex flex-wrap items-center gap-4 self-start md:self-end">
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 text-gray-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase italic"
              title={isAutoplay ? "Pausar Autoplay" : "Iniciar Autoplay"}
            >
              {isAutoplay ? <Pause className="w-4 h-4 text-accent" /> : <Play className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAutoplay ? "Autoplay ON" : "Autoplay OFF"}</span>
            </button>

            <button 
              onClick={scrollLeft}
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 text-white flex items-center justify-center hover:bg-accent/10 transition-all duration-300"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 text-white flex items-center justify-center hover:bg-accent/10 transition-all duration-300"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* CATEGORY / FOLDER SELECTOR (TABS) */}
        <div className="relative mb-12">
          <div className="flex overflow-x-auto items-center gap-4 pb-4 no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 snap-x">
            {sortedCategories.map((category) => {
              const isActive = activeCategory === category;
              
              if (category.startsWith('Edecan')) {
                const avatarSrc = categoryAvatars[category];
                if (!avatarSrc) return null;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    title={category}
                    className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-full overflow-hidden border-2 transition-all duration-300 snap-start ${
                      isActive 
                        ? 'border-accent scale-110 shadow-[0_0_20px_rgba(204,255,0,0.5)]' 
                        : 'border-white/10 hover:border-accent/70'
                    }`}
                  >
                    <img src={avatarSrc} alt={`Galería ${category}`} className="w-full h-full object-cover" />
                    {isActive && <div className="absolute inset-0 bg-accent/20" />}
                  </button>
                );
              } else { // For "Eventos" and other text-based categories
                const count = categorizedImages[category]?.length || 0;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`group relative py-3 px-4 md:px-6 rounded-2xl text-xs md:text-sm font-black tracking-widest uppercase italic transition-all duration-300 flex items-center gap-2 whitespace-nowrap snap-start cursor-pointer border ${
                      isActive 
                        ? 'border-accent/50 text-white bg-accent/5' 
                        : 'border-white/5 text-gray-500 hover:text-white hover:border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 transition-transform group-hover:rotate-12 ${isActive ? 'text-accent' : 'text-gray-600 group-hover:text-gray-400'}`} />
                    <span>{category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-accent/20 text-accent' : 'bg-white/5 text-gray-600 group-hover:text-gray-400'
                    }`}>
                      {count}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryIndicator"
                        className="absolute inset-0 border border-accent rounded-2xl -z-10 shadow-[0_0_15px_rgba(204,255,0,0.25)]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              }
            })}
          </div>
        </div>

        {/* CAROUSEL TRACK */}
        <div 
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 px-1 no-scrollbar cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {activeImages.map((image, index) => (
            <motion.div
              key={image.originalPath}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4) }}
              viewport={{ once: true }}
              onClick={() => setLightboxIndex(index)}
              className="w-72 h-96 md:w-80 md:h-[28rem] flex-shrink-0 rounded-3xl overflow-hidden relative cursor-pointer group snap-start border border-white/5 bg-white/[0.02] hover:border-accent/40 transition-all duration-500 shadow-2xl"
            >
              {/* Image element */}
              <img 
                src={image.src} 
                alt={`${activeCategory} image ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-110 pointer-events-none"
                loading="lazy"
              />

              {/* High-End Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500" />

              {/* Elegant Hover Zoom Indicator */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                <Maximize2 className="w-5 h-5 text-accent" />
              </div>


            </motion.div>
          ))}

          {activeImages.length === 0 && (
            <div className="w-full py-24 text-center text-gray-500 text-lg font-bold uppercase italic">
              No se encontraron imágenes en esta categoría.
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxIndex !== null && activeImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top Close Bar & Info */}
            <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 flex justify-between items-center z-10 pointer-events-none">
              <div className="text-white text-left">
                <span className="text-accent font-black tracking-[0.4em] uppercase text-xs block mb-1">Galería // {activeCategory}</span>
                <span className="text-sm font-mono text-white/60">Imagen {lightboxIndex + 1} de {activeImages.length}</span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent text-white flex items-center justify-center transition-all duration-300 pointer-events-auto"
                aria-label="Cerrar"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Left Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-4 md:left-8 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/15 text-white flex items-center justify-center transition-all duration-300 z-10"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Main Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative max-w-full max-h-[75vh] md:max-h-[80vh] flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImages[lightboxIndex].src}
                alt={`${activeCategory} full size image ${lightboxIndex + 1}`}
                className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain block pointer-events-none"
              />
            </motion.div>

            {/* Right Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-4 md:right-8 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/15 text-white flex items-center justify-center transition-all duration-300 z-10"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Bottom Keyboard Navigation Hints */}
            <div className="absolute bottom-4 text-center text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase hidden md:block">
              Usa las flechas del teclado <span className="text-accent">← / →</span> para navegar · <span className="text-accent">ESC</span> para salir
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Carousel;
