import React from 'react';
import whatsappLogo from '../../assets/Digital_Glyph_Green.png';

const WhatsAppButton = () => {
  // REPLACE THIS WITH THE RESTAURANT'S REAL NUMBER
  const phoneNumber = "254700000000"; 
  const message = "Hi Notsro! I have a question about the menu.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group"
    >
      {/* Container for animation */}
      <div className="relative transition-transform duration-300 transform group-hover:scale-110">
        
        {/* THE ICON */}
        <img 
          src={whatsappLogo} 
          alt="Chat on WhatsApp" 
          // Default: Subtle shadow
          // Hover: Intense Green Glow (drop-shadow)
          className="w-8 h-8 drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(37,211,102,0.9)]" 
        />
        
        {/* Tooltip (Appears on Hover) */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-black px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl pointer-events-none">
          Chat with us
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-white transform rotate-45"></div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;