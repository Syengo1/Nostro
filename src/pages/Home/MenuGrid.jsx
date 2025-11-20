import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react'; // Added Search Icon
import MenuCard from '../../components/ui/MenuCard';
import { categories } from '../../data/menuData';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast'; // <--- Import Toast

const MenuGrid = ({ onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Burgers');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // <--- Search State
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('is_available', { ascending: false });

      if (error) console.error('Error:', error);
      else setMenuItems(data);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 350;
      direction === 'left' ? current.scrollBy({ left: -scrollAmount, behavior: 'smooth' }) : current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // WRAPPER FOR ADD TO CART TO SHOW TOAST
  const handleAddWithToast = (item) => {
    onAddToCart(item);
    toast.success(`${item.name} added to order!`);
  };

  // FILTER LOGIC: Category + Search
  const items = menuItems.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If searching, ignore category. If not searching, use category.
    return searchQuery ? matchesSearch : matchesCategory;
  });

  return (
    <section className="py-24 bg-nostro-black relative overflow-hidden" id="menu">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
            Our Curated <span className="text-nostro-orange">Menu</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Handcrafted with passion. Swipe to explore the boldest flavors in Nairobi.
          </p>
        </div>

        {/* --- SEARCH BAR (New Premium Feature) --- */}
        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search for burgers, drinks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white focus:border-nostro-orange focus:outline-none transition-all focus:bg-white/10"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-white/40 hover:text-white text-xs font-bold uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* CATEGORIES (Hide if searching) */}
        {!searchQuery && (
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  if(scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                }}
                className={`px-6 py-2 rounded-full text-sm tracking-widest uppercase transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-nostro-orange border-nostro-orange text-white shadow-glow'
                    : 'bg-transparent border-white/10 text-white/60 hover:border-white/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-nostro-orange border-t-transparent rounded-full animate-spin"></div></div>
        ) : (
          <div className="relative group">
            {/* Arrows logic remains... */}
            {!searchQuery && items.length > 2 && (
              <>
                <button onClick={() => scroll('left')} className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-nostro-black/80 border border-white/10 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-nostro-orange hover:border-nostro-orange shadow-2xl"><ChevronLeft className="w-6 h-6" /></button>
                <button onClick={() => scroll('right')} className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-nostro-black/80 border border-white/10 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-nostro-orange hover:border-nostro-orange shadow-2xl"><ChevronRight className="w-6 h-6" /></button>
              </>
            )}

            <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-nostro-black to-transparent z-20 pointer-events-none" />
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-nostro-black to-transparent z-20 pointer-events-none" />

            <div 
              ref={scrollContainerRef}
              className={`flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory px-4 md:px-0 scroll-smooth ${items.length === 1 ? 'justify-center' : ''} ${items.length === 2 ? 'md:justify-center' : ''}`}
            >
              <AnimatePresence mode='popLayout'>
                {items.length > 0 ? items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="min-w-[85vw] md:min-w-[350px] snap-center"
                  >
                    {/* UPDATED: Pass the Toast wrapper */}
                    <MenuCard item={item} onAdd={() => handleAddWithToast(item)} />
                  </motion.div>
                )) : (
                  <div className="w-full text-center text-white/50 py-10 italic">
                    No items found matching "{searchQuery}".
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link to="/menu">
            <button className="group px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2">
              Explore Full Menu <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuGrid;