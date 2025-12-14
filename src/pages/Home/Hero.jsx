import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// High-Quality, Dark & Moody Food Images
const slides = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1920&q=80", // Burger
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1920&q=80", // Pizza
  "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D", // Steak/Grill
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1920&q=80"  // Drink/Atmosphere
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-notsro-black">
      
      {/* --- 1. BACKGROUND SLIDESHOW --- */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt="Delicious Food"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }} // Slow, calming fade
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        
        {/* Dark Gradient Overlay (Crucial for Text Readability) */}
        <div className="absolute inset-0 bg-gradient-to-b from-notsro-black/90 via-notsro-black/50 to-notsro-black z-10"></div>
        
        {/* Texture Overlay (Optional: Adds a grainy film look for premium feel) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-10 mix-blend-overlay"></div>
      </div>

      {/* --- 2. CONTENT LAYER --- */}
      <div className="container mx-auto px-6 relative z-20 text-center pt-20">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 border border-white/10 backdrop-blur-md shadow-lg"
        >
          <Star className="w-4 h-4 text-notsro-gold fill-notsro-gold" />
          <span className="text-xs font-sans tracking-widest uppercase text-white font-bold">Nairobi's Premier Fast Food</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-[1.1] mb-8 drop-shadow-2xl"
        >
          Crafted for the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-notsro-orange to-amber-500">Bold & Hungry.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-md"
        >
          Experience the perfect fusion of gourmet ingredients and Nairobi street culture. 
          Welcome to the new standard of taste.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <a href="#menu">
            <button className="group relative px-8 py-4 bg-notsro-orange text-white font-bold rounded-full overflow-hidden shadow-[0_0_40px_rgba(234,88,12,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(234,88,12,0.5)]">
              <span className="relative z-10 flex items-center gap-2">
                Order Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </a>
          
          <Link to="/menu">
            <button className="px-8 py-4 border border-white/20 bg-white/5 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 font-medium">
              View Full Menu
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;