import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, CheckCircle, User, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ReservationModal = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState('idle'); // idle, submitting, success
  
  // Get Today's Date string (YYYY-MM-DD) for the input limit
  const todayString = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2 People'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Basic Field Validation
    if(!formData.name || !formData.phone || !formData.date || !formData.time) {
      alert("Please fill in all fields.");
      return;
    }

    // 2. TIME TRAVEL CHECK 🛑
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("You cannot book a table in the past. Please check your date and time.");
      return;
    }

    setStatus('submitting');

    // 3. Save to Supabase
    const { error } = await supabase
      .from('reservations')
      .insert([formData]);

    if (error) {
      console.error("Reservation Error:", error);
      alert("Error connecting to server. Please call us directly.");
      setStatus('idle');
    } else {
      setStatus('success');
      // Reset form after delay
      setTimeout(() => {
        setStatus('idle');
        setFormData({ name: '', phone: '', date: '', time: '', guests: '2 People' });
        onClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-lg bg-nostro-charcoal border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>

          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-nostro-black mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">Table Reserved!</h3>
              <p className="text-white/60">We look forward to hosting you.</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Book a Table</h2>
              <p className="text-white/60 mb-8">Reserve your spot at Nairobi's premium table.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-nostro-orange" />
                      <input 
                        type="date" 
                        required 
                        min={todayString} // <--- PREVENTS SELECTING PAST DATES
                        className="w-full bg-nostro-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-nostro-orange focus:outline-none transition" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-nostro-orange" />
                      <input 
                        type="time" 
                        required 
                        className="w-full bg-nostro-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-nostro-orange focus:outline-none transition" 
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="space-y-1">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-nostro-orange" />
                    <select 
                      className="w-full bg-nostro-black border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-nostro-orange focus:outline-none appearance-none"
                      value={formData.guests}
                      onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    >
                      <option>2 People</option>
                      <option>3 People</option>
                      <option>4 People</option>
                      <option>5 People</option>
                      <option>Large Group (6+)</option>
                    </select>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-nostro-orange" />
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      required 
                      className="w-full bg-nostro-black border border-white/10 rounded-xl py-3 pl-10 px-4 text-white focus:border-nostro-orange focus:outline-none transition" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs text-white/50 uppercase tracking-widest font-bold">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-nostro-orange" />
                    <input 
                      type="tel" 
                      placeholder="07..." 
                      required 
                      className="w-full bg-nostro-black border border-white/10 rounded-xl py-3 pl-10 px-4 text-white focus:border-nostro-orange focus:outline-none transition" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  disabled={status === 'submitting'}
                  className="w-full py-4 mt-4 bg-nostro-orange hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-glow flex justify-center items-center"
                >
                  {status === 'submitting' ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Confirm Reservation"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReservationModal;