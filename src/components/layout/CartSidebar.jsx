import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Phone, CheckCircle, MapPin, Navigation, Store, User, Smartphone, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const CartSidebar = ({ isOpen, onClose, cartItems, onRemove, onCheckout, isStoreOpen = true }) => {
  const [checkoutState, setCheckoutState] = useState('idle'); 
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); 
  const [locationStatus, setLocationStatus] = useState('idle'); 
  const [address, setAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const bottomRef = useRef(null);

  const DELIVERY_FEE = 200;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = (fulfillmentType === 'delivery' ? subtotal + DELIVERY_FEE : subtotal) - discountAmount;

  useEffect(() => {
    if (fulfillmentType === 'delivery' && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [fulfillmentType]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported"); return; }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          setAddress(`GPS Pin: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)} (My Current Location)`);
          setLocationStatus('success');
        }, 1500);
      },
      () => { setLocationStatus('error'); alert("Unable to retrieve location. Please type it manually."); }
    );
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    const { data } = await supabase.from('coupons').select('*').eq('code', couponCode.toUpperCase()).eq('is_active', true).single();
    if (data) { setDiscountPercent(data.discount_percent); alert(`Success! ${data.discount_percent}% discount applied.`); } 
    else { setDiscountPercent(0); setCouponError('Invalid or expired code'); }
  };

  const handlePayment = async () => {
    if (fulfillmentType === 'delivery') {
      if (!address) { alert("Please provide a delivery location."); return; }
      if (!recipientPhone) { alert("Please provide a contact number."); return; }
    }

    setCheckoutState('processing');

    const orderData = {
      customer_details: {
        type: fulfillmentType,
        address: fulfillmentType === 'delivery' ? address : 'Westlands Branch Pickup',
        name: recipientName || 'Guest',
        phone: recipientPhone || 'N/A',
      },
      items: cartItems,
      total_amount: total,
      status: 'pending',
      discount_applied: discountPercent > 0 ? `${discountPercent}% (${couponCode})` : null 
    };

    const { error } = await supabase.from('orders').insert([orderData]);

    if (error) {
      console.error("Error saving order:", error);
      alert("Network error. Please try again.");
      setCheckoutState('idle');
      return;
    }

    setTimeout(() => { setCheckoutState('success'); }, 1500);
  };

  const closeSuccess = () => {
    onCheckout(); 
    setCheckoutState('idle');
    setAddress('');
    setRecipientName('');
    setRecipientPhone('');
    setCouponCode('');
    setDiscountPercent(0);
    setLocationStatus('idle');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-nostro-charcoal border-l border-white/10 z-[70] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-nostro-black z-10">
              <h2 className="text-2xl font-serif font-bold text-white">Your Order</h2>
              <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {checkoutState === 'processing' && <div className="h-full flex flex-col items-center justify-center space-y-6 text-center animate-pulse"><div className="w-20 h-20 border-4 border-nostro-orange border-t-transparent rounded-full animate-spin"></div><div><h3 className="text-xl font-bold text-white mb-2">Saving Order...</h3><p className="text-white/60">Connecting to Kitchen...</p></div></div>}
              {checkoutState === 'success' && <div className="h-full flex flex-col items-center justify-center space-y-6 text-center"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-nostro-black shadow-[0_0_30px_rgba(34,197,94,0.4)]"><CheckCircle className="w-12 h-12" /></motion.div><div><h3 className="text-3xl font-serif font-bold text-white mb-2">Order Received!</h3><p className="text-nostro-orange text-lg font-medium">{fulfillmentType === 'delivery' ? "The Kitchen is firing up! 🔥" : "See you at the counter! 👋"}</p><p className="text-white/40 text-sm mt-2">{fulfillmentType === 'delivery' ? "Your rider will contact you shortly." : "We'll have it ready in ~20 mins."}</p></div><button onClick={closeSuccess} className="px-8 py-3 bg-white/10 hover:bg-white hover:text-black text-white rounded-full transition mt-4">Close</button></div>}

              {checkoutState === 'idle' && (
                <div className="space-y-8">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-white/30 space-y-4"><ShoppingBag className="w-16 h-16" /><p className="font-sans text-lg">Your cart is hungry.</p></div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item, index) => (
                        <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`${item.id}-${index}`} className="flex gap-4 p-4 bg-nostro-black rounded-xl border border-white/5">
                          <img src={item.image_url || item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1 flex flex-col justify-center"><h4 className="font-serif font-bold text-white">{item.name}</h4><div className="text-nostro-orange font-bold text-sm">KES {item.price}</div></div>
                          <button onClick={() => onRemove(index)} className="text-white/30 hover:text-red-500 transition p-2"><Trash2 className="w-5 h-5" /></button>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {cartItems.length > 0 && (
                    <div className="space-y-6">
                      <div className="h-px bg-white/10 w-full"></div>
                      <div className="flex bg-nostro-black p-1 rounded-xl border border-white/10">
                        <button onClick={() => setFulfillmentType('delivery')} className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${fulfillmentType === 'delivery' ? 'bg-nostro-orange text-white shadow-lg' : 'text-white/50 hover:text-white'}`}><MapPin className="w-4 h-4" /> Delivery</button>
                        <button onClick={() => setFulfillmentType('pickup')} className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${fulfillmentType === 'pickup' ? 'bg-white text-nostro-black shadow-lg' : 'text-white/50 hover:text-white'}`}><Store className="w-4 h-4" /> Pickup</button>
                      </div>

                      <AnimatePresence mode='wait'>
                        {fulfillmentType === 'delivery' ? (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                            <div className="p-4 rounded-xl bg-nostro-black/50 border border-white/5 space-y-4">
                              <label className="text-xs uppercase text-white/50 tracking-widest font-bold">Where to?</label>
                              <button onClick={handleGetLocation} className="w-full py-3 border border-nostro-orange/30 bg-nostro-orange/10 text-nostro-orange rounded-xl flex items-center justify-center gap-2 hover:bg-nostro-orange/20 transition font-medium text-sm">{locationStatus === 'loading' ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : <Navigation className="w-4 h-4" />}{locationStatus === 'loading' ? "Locating..." : "Use Current Location"}</button>
                              <textarea placeholder="Or type address..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-nostro-charcoal border border-white/10 rounded-xl p-3 text-white text-sm focus:border-nostro-orange focus:outline-none resize-none h-20"></textarea>
                            </div>
                            <div className="p-4 rounded-xl bg-nostro-black/50 border border-white/5 space-y-4">
                              <label className="text-xs uppercase text-white/50 tracking-widest font-bold">Who is it for?</label>
                              <div className="space-y-3">
                                <div className="relative"><User className="absolute left-3 top-3 w-4 h-4 text-white/30" /><input type="text" placeholder="Receiver Name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full bg-nostro-charcoal border border-white/10 rounded-xl py-2 pl-10 pr-3 text-white text-sm focus:border-nostro-orange focus:outline-none" /></div>
                                <div className="relative"><Smartphone className="absolute left-3 top-3 w-4 h-4 text-white/30" /><input type="tel" placeholder="Receiver Phone" value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} className="w-full bg-nostro-charcoal border border-white/10 rounded-xl py-2 pl-10 pr-3 text-white text-sm focus:border-nostro-orange focus:outline-none" /></div>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-nostro-black/50 rounded-xl border border-white/10 text-center"><p className="text-nostro-orange font-bold mb-1">Westlands Branch</p><p className="text-white/60 text-xs">Delta Towers, Ground Floor</p></motion.div>
                        )}
                      </AnimatePresence>
                      <div ref={bottomRef} className="h-4"></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {cartItems.length > 0 && checkoutState === 'idle' && (
              <div className="bg-nostro-black border-t border-white/10 p-6 space-y-4 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <div className="flex gap-2">
                  <div className="relative flex-1"><Tag className="absolute left-3 top-2.5 w-4 h-4 text-white/30" /><input type="text" placeholder="PROMO CODE" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="w-full bg-nostro-black border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white uppercase focus:border-nostro-orange focus:outline-none" /></div>
                  <button onClick={handleApplyCoupon} className="px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition">APPLY</button>
                </div>
                {couponError && <p className="text-red-500 text-xs">{couponError}</p>}

                <div className="space-y-2">
                  <div className="flex justify-between text-white/60 text-sm"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                  {fulfillmentType === 'delivery' && <div className="flex justify-between text-nostro-orange text-sm"><span>Delivery Fee</span><span>+ KES {DELIVERY_FEE}</span></div>}
                  {discountPercent > 0 && <div className="flex justify-between text-green-400 text-sm"><span>Discount ({discountPercent}%)</span><span>- KES {discountAmount.toLocaleString()}</span></div>}
                  <div className="flex justify-between text-2xl font-serif font-bold text-white pt-2 border-t border-white/5 mt-2"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
                </div>

                {/* STORE CLOSED LOGIC */}
                {!isStoreOpen && (
                  <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs text-center">
                    Sorry, we are currently closed. Please try again later.
                  </div>
                )}

                <button 
                  onClick={handlePayment}
                  disabled={!isStoreOpen} 
                  className={`w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-3 transition-all shadow-glow active:scale-95 ${!isStoreOpen ? 'bg-zinc-700 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-500'}`}
                >
                  {fulfillmentType === 'delivery' ? 'Confirm & Pay' : 'Pay for Pickup'} <Phone className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
