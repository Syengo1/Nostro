import React, { useEffect, useState, useRef } from 'react';
import { Star, Quote, Plus, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState({ name: '', location: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollContainerRef = useRef(null);

  // Fetch Approved Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(10); // Increased limit since it's a slider now
      
      if (data) setReviews(data);
    };
    fetchReviews();
  }, []);

  // Scroll Handler (Slider Logic)
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 400; // Card width
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.text) return toast.error("Please fill in details.");
    
    setIsSubmitting(true);
    const { error } = await supabase.from('reviews').insert([{ ...formData, rating }]);
    
    setIsSubmitting(false);
    
    if (error) {
      toast.error("Error submitting review.");
    } else {
      toast.success("Review submitted! Pending approval.");
      setIsModalOpen(false);
      setFormData({ name: '', location: '', text: '' });
      setRating(5);
    }
  };

  return (
    <section className="py-20 bg-notsro-black border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* --- CENTERED HEADER --- */}
        <div className="flex flex-col items-center text-center mb-16 space-y-6">
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">
            What Nairobi is <span className="text-notsro-orange">Eating</span>
          </h2>

          <div className="flex flex-col items-center gap-2">
            <div className="flex text-notsro-orange gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
            </div>
            <span className="text-white/60 text-sm tracking-widest uppercase">Based on happy customers</span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-notsro-orange hover:border-notsro-orange text-white rounded-full transition-all duration-300 flex items-center gap-2 text-sm font-bold shadow-glow group"
          >
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Write a Review
          </button>
        </div>

        {/* --- SLIDER SECTION --- */}
        <div className="relative group">
          
          {/* Left Arrow */}
          {reviews.length > 2 && (
            <button 
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-notsro-black/80 border border-white/10 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-notsro-orange hover:border-notsro-orange shadow-2xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {reviews.length > 2 && (
            <button 
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-notsro-black/80 border border-white/10 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-notsro-orange hover:border-notsro-orange shadow-2xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Fading Gradients (The "Fading Animation" Effect) */}
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-notsro-black to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-notsro-black to-transparent z-20 pointer-events-none" />

          {/* Scroll Container */}
          {reviews.length === 0 ? (
            <p className="text-white/30 italic text-center py-10">No reviews yet. Be the first!</p>
          ) : (
            <div 
              ref={scrollContainerRef}
              className={`flex gap-6 overflow-x-auto no-scrollbar pb-10 snap-x snap-mandatory px-4 scroll-smooth ${reviews.length < 3 ? 'justify-center' : ''}`}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="min-w-[85vw] md:min-w-[400px] bg-notsro-charcoal p-8 rounded-2xl border border-white/5 relative group hover:border-notsro-orange/30 transition-all duration-500 snap-center flex flex-col justify-between"
                >
                  <Quote className="absolute top-6 right-6 w-10 h-10 text-white/5 group-hover:text-notsro-orange/10 transition-colors" />
                  
                  <div className="flex gap-1 text-notsro-orange mb-6">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  
                  <p className="text-white/90 leading-relaxed text-lg font-light mb-8 italic">
                    "{review.text}"
                  </p>
                  
                  <div className="border-t border-white/5 pt-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-notsro-orange to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{review.name}</h4>
                      <p className="text-xs text-white/40 uppercase tracking-wider">{review.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- REVIEW MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-notsro-charcoal border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Rate your experience</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-white/50 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star Rating Input */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transform hover:scale-110 transition">
                      <Star className={`w-10 h-10 ${star <= rating ? 'text-notsro-orange fill-notsro-orange' : 'text-white/10'}`} />
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  <input 
                    type="text" placeholder="Your Name" required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-notsro-orange focus:outline-none transition"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Location (e.g. Kilimani)" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-notsro-orange focus:outline-none transition"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                  <textarea 
                    placeholder="How was the food? Tell us everything..." required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:border-notsro-orange focus:outline-none h-32 resize-none transition"
                    value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})}
                  />
                </div>

                <button disabled={isSubmitting} className="w-full py-4 bg-notsro-orange hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-glow mt-2">
                  {isSubmitting ? "Submitting..." : <><Send className="w-4 h-4" /> Submit Review</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Reviews;