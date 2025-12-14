import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom'; // <--- IMPORT ADDED

const Story = () => {
  return (
    <section id="story" className="py-24 bg-notsro-charcoal overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: The Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative h-[500px] rounded-3xl overflow-hidden border border-white/10">
              
              <img 
                src="https://media.istockphoto.com/id/2172584800/photo/smiling-chef-holding-burger-and-fries-in-restaurant-kitchen.webp?a=1&b=1&s=612x612&w=0&k=20&c=OqRSWZo83nv7yX3qdgOziT4TdjDxXQUDRm5ien1yOEc=" 
                alt="Chef holding a plate of food" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 right-8 bg-notsro-black/90 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-2xl">
                <div className="text-3xl font-serif font-bold text-notsro-orange">100%</div>
                <div className="text-sm text-white/60 uppercase tracking-widest">Kenyan Beef</div>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-notsro-orange rounded-tl-3xl"></div>
          </motion.div>

          {/* Right: The Narrative */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2"
          >
            <h4 className="text-notsro-orange font-bold tracking-widest uppercase mb-2">The Notsro Heritage</h4>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              More Than Just <br/> Fast Food.
            </h2>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Founded in the heart of Nairobi, Notsro was born from a simple rebellion: fast food shouldn't taste cheap. We partner with local farmers in <strong>Naivasha</strong> and <strong>Kinangop</strong> to bring farm-fresh produce directly to our grills.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-notsro-orange/20 flex items-center justify-center text-notsro-orange"><Check className="w-5 h-5" /></div>
                <span className="text-white font-medium">Grass-fed beef, never frozen.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-notsro-orange/20 flex items-center justify-center text-notsro-orange"><Check className="w-5 h-5" /></div>
                <span className="text-white font-medium">Artisan brioche buns baked daily.</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-notsro-orange/20 flex items-center justify-center text-notsro-orange"><Check className="w-5 h-5" /></div>
                <span className="text-white font-medium">Secret sauces crafted by Chef Kamanu.</span>
              </div>
            </div>

            {/* FIX: Changed from button to Link */}
            <Link 
              to="/our-story" 
              className="text-white border-b border-notsro-orange pb-1 hover:text-notsro-orange transition-colors inline-block"
            >
              Read our full story
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Story;