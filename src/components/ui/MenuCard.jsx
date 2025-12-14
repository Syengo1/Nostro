import React from 'react';
import { Plus, Flame, Ban } from 'lucide-react';

const MenuCard = ({ item, onAdd }) => {
  const imageSource = item.image_url || item.image;
  
  // Logic: Is there a deal?
  const hasDeal = item.sale_price && item.sale_price < item.price;
  
  // Logic: Is it sold out?
  const isSoldOut = !item.is_available;

  return (
    <div className={`group relative bg-notsro-charcoal rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col h-full ${
      isSoldOut 
        ? 'border-white/5 opacity-70 grayscale' 
        : 'border-white/5 hover:border-notsro-orange/50 hover:shadow-2xl hover:shadow-notsro-orange/10'
    }`}>
      
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img 
          src={imageSource} 
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${isSoldOut ? '' : 'group-hover:scale-110'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-notsro-black/90 via-transparent to-transparent opacity-60"></div>
        
        {/* TAGS OVERLAY */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isSoldOut && (
            <div className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase rounded-full shadow-lg flex items-center gap-1">
              <Ban className="w-3 h-3" /> Sold Out
            </div>
          )}

          {!isSoldOut && hasDeal && (
            <div className="px-3 py-1 bg-notsro-orange text-white text-xs font-bold uppercase rounded-full shadow-lg flex items-center gap-1 animate-pulse">
              <Flame className="w-3 h-3" /> Special Offer
            </div>
          )}

          {!isSoldOut && !hasDeal && item.tag && (
            <div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase rounded-full shadow-lg">
              {item.tag}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-serif font-bold text-white group-hover:text-notsro-orange transition-colors">
            {item.name}
          </h3>
          
          {/* PRICE LOGIC */}
          <div className="text-right ml-2">
            {hasDeal ? (
              <>
                <div className="text-xs text-white/40 line-through decoration-red-500 decoration-2">
                  KES {item.price}
                </div>
                <div className="text-lg font-bold text-notsro-orange">
                  KES {item.sale_price}
                </div>
              </>
            ) : (
              <span className="text-lg font-bold text-notsro-gold">
                <span className="text-xs text-white/50 font-sans font-normal mr-1">KES</span>
                {item.price}
              </span>
            )}
          </div>
        </div>
        
        <p className="text-white/60 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
          {item.description}
        </p>
        
        {/* Add Button */}
        <button 
          onClick={isSoldOut ? null : onAdd}
          disabled={isSoldOut}
          className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 mt-auto ${
            isSoldOut 
              ? 'bg-white/5 text-white/30 cursor-not-allowed' 
              : 'bg-white/5 hover:bg-notsro-orange text-white hover:text-white group-hover:translate-y-[-2px]'
          }`}
        >
          {isSoldOut ? "Unavailable" : (
            <>
              <Plus className="w-4 h-4" /> Add to Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MenuCard;