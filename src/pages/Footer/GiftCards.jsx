import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Gift, ArrowLeft } from 'lucide-react'; 
import { Link } from 'react-router-dom'; 

const GiftCards = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const { data } = await supabase.from('gift_cards').select('*').eq('is_active', true);
      if (data) setCards(data);
    };
    fetchCards();
  }, []);

  const handleBuy = (card) => {
    const msg = `Hi Nostro! I want to buy the "${card.name}" Gift Card worth KES ${card.value}.`;
    window.open(`https://wa.me/254700000000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-nostro-black text-white pt-12 pb-20 px-6">
      <div className="container mx-auto text-center">
        
        {/* BACK BUTTON - ALIGNMENT FIX */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-nostro-orange hover:text-white transition group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Give the Gift of <span className="text-nostro-orange">Flavor</span>.</h1>
        <p className="text-white/60 mb-16">Perfect for birthdays, anniversaries, or just saying thanks.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map(card => (
            <div key={card.id} className="group relative rounded-2xl overflow-hidden cursor-pointer transition-transform hover:-translate-y-2" onClick={() => handleBuy(card)}>
              {/* Card Visual */}
              <div className="bg-gradient-to-br from-nostro-orange to-red-700 h-56 p-6 flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <span className="font-serif font-bold text-2xl">NOSTRO.</span>
                  <Gift className="w-6 h-6 text-white/50" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">{card.name}</h3>
                  <p className="text-white/80 text-sm">Worth KES {card.value}</p>
                </div>
              </div>
              
              {/* Price Tag */}
              <div className="bg-nostro-charcoal p-4 flex justify-between items-center border border-white/10 border-t-0 rounded-b-2xl">
                <div>
                  <span className="text-xs text-white/50 uppercase font-bold">Price</span>
                  <div className="text-xl font-bold text-white">KES {card.price}</div>
                </div>
                <button className="px-4 py-2 bg-white text-nostro-black font-bold rounded-lg hover:bg-nostro-orange hover:text-white transition">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GiftCards;