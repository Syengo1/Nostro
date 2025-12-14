import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone } from 'lucide-react';

const PromoBanner = () => {
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    const fetchPromo = async () => {
      // Get the active promo (we assume there is only one main promo for now)
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();
      
      setPromo(data);
    };

    // Subscribe to realtime changes (So if Admin updates it, user sees it instantly)
    const subscription = supabase
      .channel('promotions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'promotions' }, () => {
        fetchPromo();
      })
      .subscribe();

    fetchPromo();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!promo) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className={`${promo.bg_color || 'bg-notsro-orange'} text-white text-center py-3 px-4 font-bold text-sm flex items-center justify-center gap-2 relative z-[60] shadow-lg`}
      >
        <Megaphone className="w-4 h-4 animate-bounce" />
        <span className="tracking-wide uppercase">{promo.text}</span>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBanner;