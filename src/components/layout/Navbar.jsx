import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add onOpenReservation prop
const Navbar = ({ cartCount = 0, onOpenCart, onOpenReservation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // LOGO REFRESH FUNCTION
  const handleLogoClick = () => {
    window.scrollTo(0, 0); // Scroll to top first for smooth feel
    window.location.reload(); // Hard refresh
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-notsro-black/90 backdrop-blur-md border-white/10 py-4' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* 1. CLICKABLE LOGO */}
          <button onClick={handleLogoClick} className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-white cursor-pointer hover:opacity-80 transition">
            NOTSRO<span className="text-notsro-orange">.</span>
          </button>

          {/* 2. WORKING NAVIGATION LINKS (using href="#id") */}
          <div className="hidden md:flex items-center gap-8 font-sans text-sm tracking-widest uppercase">
            <a href="#menu" className="hover:text-notsro-orange transition-colors duration-300">Menu</a>
            <a href="#story" className="hover:text-notsro-orange transition-colors duration-300">Our Story</a>
            <a href="#locations" className="hover:text-notsro-orange transition-colors duration-300">Locations</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* 3. CONNECT RESERVE BUTTON */}
            <button 
              onClick={onOpenReservation}
              className="hidden md:flex items-center gap-2 px-5 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-widest"
            >
              <Phone className="w-3 h-3" /> Reserve
            </button>
            
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-white hover:text-notsro-orange transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-notsro-orange text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-8 h-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed inset-0 z-[60] bg-notsro-black flex flex-col justify-center items-center"
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-white/50 hover:text-white"
            >
              <X className="w-10 h-10" />
            </button>
            
            <div className="flex flex-col gap-8 text-center font-serif text-3xl text-white">
              <a href="#menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</a>
              <a href="#story" onClick={() => setIsMobileMenuOpen(false)}>Story</a>
              <a href="#locations" onClick={() => setIsMobileMenuOpen(false)}>Locations</a>
              <button onClick={() => { setIsMobileMenuOpen(false); onOpenReservation(); }} className="text-notsro-orange">Reserve Table</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;