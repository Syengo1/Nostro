import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import MenuCard from '../../components/ui/MenuCard';
import { supabase } from '../../lib/supabaseClient'; // <--- CONNECTED TO DB

const FullMenu = ({ onAddToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // FETCH LIVE DATA
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true) // Only show active items
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching menu:', error);
      } else {
        setMenuItems(data);
      }
      setLoading(false);
    };

    fetchMenu();
  }, []);

  // Extract unique categories from the actual data
  const categories = [...new Set(menuItems.map(item => item.category))];

  const handleDownloadPDF = () => {
    alert("Feature coming soon: This will download the PDF menu.");
  };

  return (
    <div className="min-h-screen bg-notsro-black pt-24 pb-20 px-6">
      
      {/* Header */}
      <div className="container mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-notsro-orange hover:text-white transition mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
              The Full <span className="text-notsro-orange">Selection</span>
            </h1>
          </div>

          <button 
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-notsro-charcoal border border-white/10 rounded-xl text-white hover:bg-white hover:text-black transition flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-notsro-orange group-hover:text-white transition">
              <FileText className="w-4 h-4" />
            </div>
            <span>Download PDF</span>
            <Download className="w-4 h-4 text-white/50 group-hover:text-black" />
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-12 h-12 border-4 border-notsro-orange border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="container mx-auto space-y-20">
          {categories.map((category) => {
            const items = menuItems.filter(item => item.category === category);
            if (items.length === 0) return null;

            return (
              <section key={category} id={category.toLowerCase()}>
                <h2 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-4">
                  {category}
                  <span className="h-px flex-1 bg-gradient-to-r from-notsro-orange/50 to-transparent"></span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={() => onAddToCart(item)} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
      
      <div className="text-center mt-20 text-white/40 text-sm">
        * Menu items and prices subject to availability and seasonal changes.
      </div>
    </div>
  );
};

export default FullMenu;