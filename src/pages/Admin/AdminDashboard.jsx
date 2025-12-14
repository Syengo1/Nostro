import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom'; 
import { RefreshCw, MessageCircle, Edit, Plus, UtensilsCrossed, X, Save, Calendar, Tag, Trash2, Clock, CheckCircle, XCircle, Megaphone, BellRing, Mail, DollarSign, TrendingUp, ShoppingBag, Power, Briefcase, Gift, Star, MapPin, Eye, Upload, Image as ImageIcon, AlertCircle, Archive } from 'lucide-react';

// ------------------------------------------------------------------
// 📧 EMAIL CONFIGURATION (Uncomment and fill to enable)
// import emailjs from '@emailjs/browser'; 
// const EMAIL_SERVICE_ID = "YOUR_SERVICE_ID";
// const EMAIL_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
// const EMAIL_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
// ------------------------------------------------------------------

const AdminDashboard = () => {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState('live'); 
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [promoText, setPromoText] = useState('');

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('menu'); // 'menu', 'job', 'card'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({}); 
  
  // --- IMAGE UPLOAD STATE ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [newCoupon, setNewCoupon] = useState({ code: '', discount_percent: '' });

  // --- 1. FETCH DATA (ALL TABLES) ---
  const fetchData = async () => {
    setLoading(true);
    
    const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (orderData) setOrders(orderData);

    const { data: menuData } = await supabase.from('menu_items').select('*').order('category', { ascending: true });
    if (menuData) setMenuItems(menuData);

    const { data: resData } = await supabase.from('reservations').select('*').order('date', { ascending: true });
    if (resData) setReservations(resData);

    const { data: couponData } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (couponData) setCoupons(couponData);

    const { data: reviewData } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (reviewData) setReviews(reviewData);

    const { data: jobsData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    if (jobsData) setJobs(jobsData);

    const { data: cardsData } = await supabase.from('gift_cards').select('*');
    if (cardsData) setGiftCards(cardsData);

    const { data: promoData } = await supabase.from('promotions').select('*').limit(1).single();
    if (promoData) setPromoText(promoData.text);

    const { data: settingsData } = await supabase.from('settings').select('*').single();
    if (settingsData) setIsStoreOpen(settingsData.is_store_open);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- STATS LOGIC ---
  const getStats = () => {
    const today = new Date().toDateString();
    const todaysOrders = orders.filter(o => new Date(o.created_at).toDateString() === today && o.status !== 'cancelled');
    const revenue = todaysOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    return { count: todaysOrders.length, revenue };
  };
  const stats = getStats();

  // --- STORE ACTIONS ---
  const toggleStoreStatus = async () => {
    const newStatus = !isStoreOpen;
    if (confirm(newStatus ? "Open Store?" : "Close Store?")) {
      await supabase.from('settings').update({ is_store_open: newStatus }).eq('id', 1);
      setIsStoreOpen(newStatus);
    }
  };

  // --- ORDER ACTIONS ---
  const updateOrderStatus = async (orderId, newStatus) => { 
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId); 
    fetchData(); 
  };

  const sendWhatsApp = (order) => {
    const customerName = order.customer_details.name;
    let phone = order.customer_details.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '254' + phone.substring(1);
    const itemsList = order.items.map(i => `1x ${i.name}`).join(', ');
    const msg = `Hi ${customerName}! 👋\nNotsro has received your order #${order.id}:\n*${itemsList}*\n\nThe kitchen is firing up! 🔥\nWe will notify you when it's ready.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    updateOrderStatus(order.id, 'cooking');
  };

  // --- RESERVATION ACTIONS (FIXED LOGIC) ---
  const isPastDue = (resDate, resTime) => {
    const resDateTime = new Date(`${resDate}T${resTime}`);
    const now = new Date();
    return resDateTime < now;
  };

  const confirmReservation = async (reservation) => {
    await supabase.from('reservations').update({ status: 'confirmed' }).eq('id', reservation.id);
    // emailjs.send(...) 
    alert("Reservation Confirmed!"); 
    fetchData();
  };

  const deleteReservation = async (id) => {
    if(confirm("Archive/Delete this reservation?")) {
      const { error } = await supabase.from('reservations').delete().eq('id', id);
      if (error) alert("Error deleting: " + error.message);
      else fetchData();
    }
  };

  const sendReservationReminder = (reservation) => {
    const customerName = reservation.name;
    let phone = reservation.phone.replace(/\D/g, '');
    if (phone.startsWith('0')) phone = '254' + phone.substring(1);
    const msg = `Hi ${customerName}! 👋\nReminder for your reservation at Notsro tonight.\nDate: ${reservation.date}\nTime: ${reservation.time}\nSee you soon!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // --- CONTENT ACTIONS ---
  const toggleAvailability = async (id, currentStatus) => { await supabase.from('menu_items').update({ is_available: !currentStatus }).eq('id', id); fetchData(); };
  const updatePrice = async (id) => { const p = prompt("New Price:"); if (p && !isNaN(p)) { await supabase.from('menu_items').update({ price: parseInt(p) }).eq('id', id); fetchData(); } };
  const toggleReviewApproval = async (id, currentStatus) => { await supabase.from('reviews').update({ is_approved: !currentStatus }).eq('id', id); fetchData(); };
  const deleteReview = async (id) => { if(confirm("Delete?")) { await supabase.from('reviews').delete().eq('id', id); fetchData(); } };
  const updatePromo = async (isActive) => { await supabase.from('promotions').update({ text: promoText, is_active: isActive }).gt('id', 0); alert("Banner Updated"); };
  const handleAddCoupon = async (e) => { e.preventDefault(); await supabase.from('coupons').insert([{ ...newCoupon, discount_percent: parseInt(newCoupon.discount_percent) }]); fetchData(); setNewCoupon({ code: '', discount_percent: '' }); };
  const deleteCoupon = async (id) => { if(confirm("Delete?")) { await supabase.from('coupons').delete().eq('id', id); fetchData(); } };
  const handleDelete = async (table, id) => { if(confirm("Delete this item?")) { await supabase.from(table).delete().eq('id', id); fetchData(); } };

  // --- MODAL HANDLERS ---
  const openModal = (type, item = null) => {
    setEditingId(item ? item.id : null);
    setModalType(type);
    setSelectedFile(null);
    setIsUploading(false);
    setIsDragging(false);
    
    if (type === 'menu') {
      setFormData(item || { name: '', description: '', price: '', sale_price: '', category: 'Burgers', image_url: '', is_available: true });
    } else if (type === 'job') {
      setFormData(item || { title: '', location: '', type: 'Full-Time', description: '', is_active: true });
    } else if (type === 'card') {
      setFormData(item || { name: '', value: '', price: '', image_url: '', is_active: true });
    }
    setIsModalOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return formData.image_url; 
    setIsUploading(true);
    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('menu-images').upload(filePath, selectedFile);
    if (uploadError) { 
      console.error("Upload error:", uploadError);
      alert("Error uploading image."); 
      setIsUploading(false); 
      return null; 
    }

    const { data } = supabase.storage.from('menu-images').getPublicUrl(filePath);
    setIsUploading(false);
    return data.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 1. Handle Image Upload
    let uploadedUrl = formData.image_url;
    if (selectedFile) {
      const url = await handleUpload();
      if (!url) return; // Stop if upload failed
      uploadedUrl = url;
    }

    // 2. PREPARE PAYLOAD (FIX FOR 400 ERROR)
    // Strictly sanitize the object based on the modalType
    let table = '';
    let payload = {};

    if (modalType === 'menu') {
      table = 'menu_items';
      payload = {
        name: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        sale_price: formData.sale_price ? parseInt(formData.sale_price) : null,
        category: formData.category,
        image_url: uploadedUrl,
        is_available: formData.is_available
      };
    } else if (modalType === 'job') {
      table = 'jobs';
      payload = {
        title: formData.title,
        location: formData.location,
        type: formData.type, // 'type' exists in jobs table
        description: formData.description,
        is_active: formData.is_active
      };
    } else if (modalType === 'card') {
      table = 'gift_cards';
      payload = {
        name: formData.name,
        value: parseInt(formData.value),
        price: parseInt(formData.price),
        image_url: uploadedUrl,
        is_active: formData.is_active
      };
    }

    // 3. Database Insert/Update
    const { error } = editingId 
      ? await supabase.from(table).update(payload).eq('id', editingId)
      : await supabase.from(table).insert([payload]);

    if (!error) { 
      fetchData(); 
      setIsModalOpen(false); 
      alert("Saved Successfully!"); 
    } else { 
      alert(`Error saving: ${error.message}`); 
      console.error(error); 
    }
  };

  // FILTERS
  const liveOrders = orders.filter(o => o.status === 'pending' || o.status === 'cooking');
  const historyOrders = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

  return (
    <div className="min-h-screen bg-notsro-black text-white font-sans relative">
      {/* Navigation */}
      <div className="bg-notsro-charcoal border-b border-white/10 sticky top-0 z-40 shadow-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-white hidden md:block">Admin</h1>
            <Link to="/" target="_blank" className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-notsro-orange border border-notsro-orange/30 transition">
              <Eye className="w-4 h-4" /> View Site
            </Link>
            <button onClick={toggleStoreStatus} className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-xs uppercase tracking-widest transition-all ${isStoreOpen ? 'bg-green-900/30 border-green-500 text-green-400' : 'bg-red-900/30 border-red-500 text-red-400'}`}>
              <Power className="w-4 h-4" /> {isStoreOpen ? "Open" : "Closed"}
            </button>
          </div>
          <div className="flex gap-2 bg-black/50 p-1 rounded-lg whitespace-nowrap">
            {['live', 'history', 'menu', 'reservations', 'coupons', 'deals', 'reviews', 'jobs', 'gift cards'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-md text-sm font-bold transition capitalize ${activeTab === tab ? 'bg-notsro-orange text-white' : 'text-white/50 hover:text-white'}`}>{tab}</button>
            ))}
          </div>
          <button onClick={fetchData} className="p-2 hover:bg-white/10 rounded-full transition shrink-0"><RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        
        {/* TAB 1: LIVE */}
        {activeTab === 'live' && (
           <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-notsro-charcoal border border-white/10 p-4 rounded-xl flex flex-col"><div className="text-white/50 text-xs uppercase font-bold mb-1 flex items-center gap-2"><ShoppingBag className="w-3 h-3" /> Orders Today</div><div className="text-2xl font-bold text-white">{stats.count}</div></div>
              <div className="bg-notsro-charcoal border border-white/10 p-4 rounded-xl flex flex-col"><div className="text-white/50 text-xs uppercase font-bold mb-1 flex items-center gap-2"><DollarSign className="w-3 h-3" /> Revenue Today</div><div className="text-2xl font-bold text-green-400">KES {stats.revenue.toLocaleString()}</div></div>
              <div className="bg-notsro-charcoal border border-white/10 p-4 rounded-xl flex flex-col"><div className="text-white/50 text-xs uppercase font-bold mb-1 flex items-center gap-2"><Clock className="w-3 h-3" /> Pending</div><div className="text-2xl font-bold text-notsro-orange">{liveOrders.length}</div></div>
              <div className="bg-notsro-charcoal border border-white/10 p-4 rounded-xl flex flex-col"><div className="text-white/50 text-xs uppercase font-bold mb-1 flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Total Items</div><div className="text-2xl font-bold text-white">{menuItems.length}</div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {liveOrders.map(order => <OrderCard key={order.id} order={order} onWhatsApp={sendWhatsApp} onStatusUpdate={updateOrderStatus} />)}
            </div>
           </>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === 'history' && <div className="space-y-4">{historyOrders.map(order => (<div key={order.id} className="bg-notsro-charcoal border border-white/5 p-4 rounded-xl flex justify-between items-center opacity-75"><div><span className={`text-xs font-bold px-2 py-1 rounded uppercase mr-3 ${order.status === 'delivered' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>{order.status}</span><span className="font-bold">#{order.id}</span></div><div className="text-right"><div className="font-bold">KES {order.total_amount}</div><div className="text-xs text-white/50">{order.customer_details.name}</div></div></div>))}</div>}
        
        {/* TAB 3: MENU */}
        {activeTab === 'menu' && (
           <div><div className="flex justify-between mb-6"><h2 className="text-2xl font-bold">Menu Items</h2><button onClick={() => openModal('menu')} className="px-4 py-2 bg-green-600 rounded flex gap-2"><Plus className="w-4 h-4"/> Add</button></div>
           <div className="bg-notsro-charcoal border border-white/10 rounded-xl overflow-hidden overflow-x-auto"><table className="w-full text-left text-sm text-white/70"><thead className="bg-black text-white uppercase font-bold text-xs"><tr><th className="p-4">Item</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{menuItems.map(item => (<tr key={item.id} className="hover:bg-white/5 transition"><td className="p-4 font-medium text-white">{item.name}</td><td className="p-4">{item.category}</td><td className="p-4">{item.sale_price ? <div><span className="text-green-400 font-bold mr-2">KES {item.sale_price}</span><span className="text-white/30 line-through text-xs">KES {item.price}</span></div> : <span className="text-notsro-orange font-bold">KES {item.price}</span>}</td><td className="p-4"><span className={`w-2 h-2 rounded-full inline-block mr-2 ${item.is_available ? 'bg-green-400' : 'bg-red-400'}`}></span>{item.is_available ? 'Stock' : 'Sold Out'}</td><td className="p-4 text-right flex justify-end gap-2"><button onClick={() => openModal('menu', item)} className="p-2 hover:bg-white/10 rounded text-blue-400"><Edit className="w-4 h-4" /></button><button onClick={() => toggleAvailability(item.id, item.is_available)} className="px-3 py-1 rounded text-xs border border-white/20">Toggle</button></td></tr>))}</tbody></table></div></div>
        )}
        
        {/* TAB 4: RESERVATIONS (FIXED PAST DUE LOGIC) */}
        {activeTab === 'reservations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{reservations.map(res => {
            const past = isPastDue(res.date, res.time);
            return (
              <div key={res.id} className={`bg-notsro-charcoal border p-6 rounded-xl flex flex-col ${past ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div><div className="text-lg font-bold text-white">{res.name}</div><div className="text-sm text-white/50">{res.phone}</div></div>
                  {past 
                    ? <span className="px-2 py-1 rounded text-xs uppercase font-bold bg-red-500/20 text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Expired</span>
                    : <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{res.status}</span>
                  }
                </div>
                <div className="flex gap-4 text-sm text-white/80 mb-4"><div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-notsro-orange" /> {res.date}</div><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-notsro-orange" /> {res.time}</div></div>
                <div className="text-sm text-white/50 mb-4">{res.guests}</div>
                <div className="mt-auto space-y-2">
                  {!past && res.status === 'pending' && <button onClick={() => confirmReservation(res)} className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold text-sm flex items-center gap-2 justify-center"><Mail className="w-4 h-4"/> Confirm</button>}
                  {res.status === 'confirmed' && !past && <button onClick={() => sendReservationReminder(res)} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-white font-bold text-sm flex items-center gap-2 justify-center"><BellRing className="w-4 h-4 text-notsro-orange"/> Reminder</button>}
                  <button onClick={() => deleteReservation(res.id)} className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded text-sm flex items-center gap-2 justify-center"><Trash2 className="w-4 h-4"/> {past ? "Archive / Delete" : "Delete"}</button>
                </div>
              </div>
            );
          })}</div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && <div className="max-w-4xl mx-auto"><form onSubmit={handleAddCoupon} className="bg-notsro-charcoal border border-white/10 p-6 rounded-xl mb-8 flex gap-4 items-end"><div className="flex-1 space-y-1"><label className="text-xs text-white/50 uppercase font-bold">Code</label><input type="text" placeholder="SALE50" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" required /></div><div className="w-32 space-y-1"><label className="text-xs text-white/50 uppercase font-bold">Discount %</label><input type="number" placeholder="20" value={newCoupon.discount_percent} onChange={e => setNewCoupon({...newCoupon, discount_percent: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" required /></div><button className="py-3 px-6 bg-notsro-orange hover:bg-orange-600 rounded-xl font-bold text-white">Create</button></form><div className="space-y-3">{coupons.map(coupon => (<div key={coupon.id} className="flex justify-between items-center bg-notsro-charcoal border border-white/10 p-4 rounded-xl"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><Tag className="w-5 h-5" /></div><div><div className="font-bold text-white tracking-widest">{coupon.code}</div><div className="text-sm text-white/50">{coupon.discount_percent}% Off</div></div></div><button onClick={() => deleteCoupon(coupon.id)} className="p-2 hover:bg-red-500/20 rounded-full text-white/30 hover:text-red-500"><Trash2 className="w-5 h-5" /></button></div>))}</div></div>}

        {/* TAB 6: DEALS */}
        {activeTab === 'deals' && <div className="max-w-2xl mx-auto text-center"><div className="bg-notsro-charcoal border border-white/10 p-8 rounded-2xl"><div className="mb-8"><div className="h-10 bg-notsro-orange rounded-lg flex items-center justify-center text-black font-bold text-sm mb-2">🔥 PREVIEW: {promoText || "No active promo"}</div></div><div className="space-y-4"><input type="text" value={promoText} onChange={(e) => setPromoText(e.target.value)} placeholder="Promo Text" className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white" /><div className="flex justify-center gap-4 pt-4"><button onClick={() => updatePromo(true)} className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Activate</button><button onClick={() => updatePromo(false)} className="px-8 py-3 bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold rounded-xl transition flex items-center gap-2"><XCircle className="w-4 h-4" /> Turn Off</button></div></div></div></div>}
        
        {/* TAB 7: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{reviews.length === 0 && <p className="text-white/30 col-span-full text-center">No reviews yet.</p>}{reviews.map(review => (<div key={review.id} className={`p-6 rounded-xl border relative ${review.is_approved ? 'bg-notsro-charcoal border-green-500/30' : 'bg-black border-white/10'}`}><div className={`absolute top-4 right-4 px-2 py-1 text-[10px] font-bold uppercase rounded ${review.is_approved ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>{review.is_approved ? "Live" : "Pending"}</div><div className="flex gap-1 text-notsro-orange mb-2">{[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}</div><p className="text-white/90 mb-4 italic">"{review.text}"</p><div className="flex justify-between items-end"><div><div className="font-bold text-white">{review.name}</div><div className="text-xs text-white/50">{review.location}</div></div><div className="flex gap-2"><button onClick={() => toggleReviewApproval(review.id, review.is_approved)} className="px-3 py-1 rounded text-xs font-bold border border-white/20">{review.is_approved ? "Hide" : "Approve"}</button><button onClick={() => deleteReview(review.id)} className="px-3 py-1 rounded text-xs font-bold border border-red-500 text-red-500">Delete</button></div></div></div>))}</div>
        )}

        {/* TAB 8: JOBS */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Careers & Jobs</h2><button onClick={() => openModal('job')} className="px-4 py-2 bg-green-600 rounded-lg font-bold flex gap-2"><Plus className="w-4 h-4"/> Post Job</button></div>
            <div className="grid gap-4">{jobs.map(job => (<div key={job.id} className="bg-notsro-charcoal p-6 rounded-xl border border-white/10 flex justify-between items-center"><div><h3 className="text-xl font-bold text-white">{job.title}</h3><p className="text-notsro-orange text-sm uppercase tracking-widest">{job.location} • {job.type}</p></div><button onClick={() => handleDelete('jobs', job.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded"><Trash2 className="w-5 h-5"/></button></div>))}</div>
          </div>
        )}

        {/* TAB 9: GIFT CARDS */}
        {activeTab === 'gift cards' && (
          <div>
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Gift Cards</h2><button onClick={() => openModal('card')} className="px-4 py-2 bg-green-600 rounded-lg font-bold flex gap-2"><Plus className="w-4 h-4"/> Create Card</button></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{giftCards.map(card => (<div key={card.id} className="bg-gradient-to-br from-notsro-orange to-red-600 p-6 rounded-xl text-white relative overflow-hidden shadow-lg group"><div className="relative z-10 pointer-events-none"><h3 className="text-2xl font-serif font-bold mb-2">{card.name}</h3><p className="text-white/80 mb-4">Value: KES {card.value}</p><div className="font-bold text-3xl">Price: {card.price}</div></div><button onClick={(e) => { e.stopPropagation(); handleDelete('gift_cards', card.id); }} className="absolute top-2 right-2 z-20 p-3 bg-black/20 hover:bg-black/60 rounded-full text-white transition cursor-pointer"><Trash2 className="w-5 h-5"/></button></div>))}</div>
          </div>
        )}

      </div>

      {/* DYNAMIC MODAL (FIXED HEIGHT + SCROLL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-notsro-charcoal w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-0 flex flex-col max-h-[90vh]">
            {/* HEADER */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-white">{editingId ? "Edit" : "Create"} {modalType === 'menu' ? 'Item' : modalType === 'job' ? 'Job' : 'Card'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-white/50 hover:text-white" /></button>
            </div>
            
            {/* SCROLLABLE BODY */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSave} className="space-y-4">
                
                {/* --- MENU FIELDS --- */}
                {modalType === 'menu' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs text-white/50 uppercase font-bold">Name</label><input type="text" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                      <div className="space-y-1"><label className="text-xs text-white/50 uppercase font-bold">Price</label><input type="number" required className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-xs text-white/50 uppercase font-bold">Category</label><select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}><option>Burgers</option><option>Pizza</option><option>Sides</option><option>Drinks</option></select></div>
                      <div className="space-y-1"><label className="text-xs text-notsro-orange uppercase font-bold">Sale Price (Optional)</label><input type="number" className="w-full bg-black/50 border border-notsro-orange/50 rounded-lg p-3 text-white" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: e.target.value})} /></div>
                    </div>
                    <div className="space-y-1"><label className="text-xs text-white/50 uppercase font-bold">Description</label><textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                    
                    {/* DRAG & DROP IMAGE UPLOAD */}
                    <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/10">
                      <label className="text-xs text-white/50 uppercase font-bold flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Product Image
                      </label>
                      
                      <div 
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${isDragging ? 'border-notsro-orange bg-notsro-orange/10' : 'border-white/20 bg-black/30'}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            setSelectedFile(e.dataTransfer.files[0]);
                          }
                        }}
                        onPaste={(e) => {
                          if (e.clipboardData.files && e.clipboardData.files[0]) {
                            setSelectedFile(e.clipboardData.files[0]);
                          }
                        }}
                      >
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        <div className="flex flex-col items-center justify-center gap-2">
                          {selectedFile ? (
                            <><div className="w-16 h-16 rounded-lg overflow-hidden border border-white/20 mb-2"><img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" /></div><p className="text-sm text-white font-bold">{selectedFile.name}</p></>
                          ) : formData.image_url ? (
                            <><img src={formData.image_url} alt="Current" className="w-12 h-12 rounded object-cover mb-2 opacity-50" /><p className="text-sm text-white/60">Current Image Loaded</p></>
                          ) : (
                            <><div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-2"><Upload className="w-6 h-6 text-white/50" /></div><p className="text-sm text-white font-bold">Click or Drag Image Here</p></>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2"><span className="text-[10px] uppercase text-white/30 font-bold">OR Paste Link</span><input type="text" placeholder="https://..." className="flex-1 bg-transparent border-b border-white/10 py-1 text-xs text-white focus:border-notsro-orange focus:outline-none" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} /></div>
                    </div>
                  </>
                )}

                {/* --- JOB FIELDS --- */}
                {modalType === 'job' && (
                  <>
                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" placeholder="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                       <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                       <select className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}><option>Full-Time</option><option>Part-Time</option></select>
                    </div>
                    <textarea className="w-full bg-black/50 border border-white/10 p-3 rounded text-white h-24" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </>
                )}

                {/* --- CARD FIELDS --- */}
                {modalType === 'card' && (
                  <>
                    <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" placeholder="Card Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                       <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" placeholder="Value (Worth)" type="number" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} required />
                       <input className="w-full bg-black/50 border border-white/10 p-3 rounded text-white" placeholder="Selling Price" type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  </>
                )}

                {/* Footer Buttons */}
                <div className="pt-4 flex gap-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition">Cancel</button>
                   <button disabled={isUploading} className="flex-[2] py-3 bg-notsro-orange hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-glow">
                     {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
                     {isUploading ? "Uploading..." : "Save"}
                   </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderCard = ({ order, onWhatsApp, onStatusUpdate }) => (
  <div className={`bg-notsro-charcoal border rounded-xl p-6 flex flex-col shadow-lg transition-all ${order.status === 'pending' ? 'border-notsro-orange ring-1 ring-notsro-orange/50' : 'border-blue-500/30'}`}>
    <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
      <div><span className={`text-xs font-bold px-2 py-1 rounded uppercase ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'}`}>{order.status}</span><h3 className="font-bold text-xl mt-2">#{order.id}</h3></div>
      <div className="text-right"><div className="text-notsro-orange font-bold text-lg">KES {order.total_amount}</div><div className="text-xs uppercase bg-white/10 px-2 py-1 rounded inline-block mt-1">{order.customer_details.type}</div></div>
    </div>
    <div className="mb-4 space-y-1 text-sm text-white/80 bg-black/20 p-3 rounded-lg"><p className="font-bold text-white">{order.customer_details.name}</p><p className="text-white/50">{order.customer_details.phone}</p><p className="text-xs mt-2 text-notsro-orange flex gap-1"><MapPin className="w-3 h-3" /> {order.customer_details.address}</p></div>
    <div className="flex-1 mb-6 space-y-2 border-l-2 border-white/10 pl-3">{order.items.map((item, idx) => (<div key={idx} className="text-sm">1x {item.name}</div>))}</div>
    {order.status === 'pending' && <button onClick={() => onWhatsApp(order)} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition mb-2"><MessageCircle className="w-4 h-4" /> Accept & Notify</button>}
    <div className="grid grid-cols-2 gap-2 mt-auto"><button onClick={() => onStatusUpdate(order.id, 'delivered')} className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-green-400">Complete</button><button onClick={() => onStatusUpdate(order.id, 'cancelled')} className="py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-red-400">Cancel</button></div>
  </div>
);

export default AdminDashboard;