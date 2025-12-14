import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-notsro-black text-white pt-12 pb-20 px-6">
      <div className="container mx-auto max-w-4xl">
        
        {/* Back Button */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-notsro-orange hover:text-white transition group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Home
          </Link>
        </div>

        {/* Header Image */}
        <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-12 relative">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=1600&q=80" 
            alt="Chef Cooking" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-notsro-black via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">The Notsro <span className="text-notsro-orange">Heritage</span>.</h1>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 text-lg text-white/80 leading-relaxed">
          <p>
            <span className="text-2xl text-white font-serif block mb-4">It started with a simple question.</span>
            Why does "fast food" have to mean "bad food"? In 2024, we set out to change the narrative in Nairobi. We believed that you could serve a burger in 5 minutes without freezing the patty or compromising on the ingredients.
          </p>
          
          <p>
            Notsro, meaning "Ours" in Italian, was born from the idea that food should bring us together. It is not just about feeding hunger; it is about feeding the soul.
          </p>

          <div className="bg-notsro-charcoal border border-white/10 p-8 rounded-2xl my-10">
            <h3 className="text-xl font-bold text-white mb-4">Our Promise to You</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-notsro-orange shrink-0" />
                <span><strong>Local Sourcing:</strong> 100% of our beef comes from grass-fed cattle in Naivasha. Our potatoes are harvested in Kinangop.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-notsro-orange shrink-0" />
                <span><strong>Zero Freezers:</strong> We don't own a freezer for our meat. It is delivered fresh daily at 5 AM.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CheckCircle className="w-6 h-6 text-notsro-orange shrink-0" />
                <span><strong>Fair Wages:</strong> We pay our riders and chefs 20% above the market rate because happy staff make better food.</span>
              </li>
            </ul>
          </div>

          <p>
            Today, Notsro has grown from a single grill in Westlands to a beloved brand across Nairobi. But our mission remains the same: <strong>To serve the boldest, freshest flavors in the city.</strong>
          </p>
          
          <div className="pt-8 text-center">
            <p className="font-serif text-2xl text-white italic">"Karibu Notsro. Taste the difference."</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OurStory;