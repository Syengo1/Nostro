import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { MapPin, Users, LockKeyhole } from 'lucide-react';
import { supabase } from './lib/supabaseClient';

// --- COMPONENT IMPORTS ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartSidebar from './components/layout/CartSidebar';
import ReservationModal from './components/ui/ReservationModal';
import WhatsAppButton from './components/common/WhatsAppButton';
import PromoBanner from './components/common/PromoBanner';

// --- PAGE IMPORTS ---
import Hero from './pages/Home/Hero';
import MenuGrid from './pages/Home/MenuGrid';
import Reviews from './pages/Home/Reviews';
import Story from './pages/Home/Story';
import FullMenu from './pages/Menu/FullMenu';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

// --- NEW FOOTER PAGE IMPORTS ---
import Careers from './pages/Footer/Careers';
import GiftCards from './pages/Footer/GiftCards';
import Privacy from './pages/Footer/Privacy';
import OurStory from './pages/Footer/OurStory';

// --- HELPER COMPONENTS ---

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-notsro-black text-center px-6">
    <div className="text-9xl font-bold text-white/10">404</div>
    <h2 className="text-3xl font-serif font-bold text-white mb-4">Oops! You're lost in the sauce.</h2>
    <p className="text-white/50 mb-8">The page you are looking for has been eaten.</p>
    <Link to="/" className="px-8 py-3 bg-notsro-orange text-white font-bold rounded-full hover:bg-orange-600 transition">Go Back Home</Link>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const HomePage = ({ addToCart }) => (
  <>
    <Hero />
    <MenuGrid onAddToCart={addToCart} />
    <Reviews />
    <Story />
  </>
);

// --- LAYOUT WRAPPER ---
const LayoutWrapper = ({ children, cartCount, onOpenCart, onOpenReservation }) => {
  const location = useLocation();
  
  // FIX: Added '/our-story' to hidden nav routes to ensure back button is clickable
  const hideNavRoutes = ['/admin', '/careers', '/gift-cards', '/privacy', '/our-story'];
  
  const shouldHideNav = hideNavRoutes.some(route => location.pathname.startsWith(route));

  return (
    <>
      {!shouldHideNav && <PromoBanner />}
      
      {!shouldHideNav && (
        <Navbar 
          cartCount={cartCount} 
          onOpenCart={onOpenCart} 
          onOpenReservation={onOpenReservation} 
        />
      )}
      
      {children}
      
      {!shouldHideNav && <WhatsAppButton />}
      {!shouldHideNav && <Footer />}
    </>
  );
};

function App() {
  // --- GLOBAL STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(true); 

  // --- STORE STATUS CHECK ---
  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setIsStoreOpen(data.is_store_open);
    };
    checkStatus();
    const subscription = supabase
      .channel('settings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings' }, (payload) => {
        setIsStoreOpen(payload.new.is_store_open);
      })
      .subscribe();
    return () => subscription.unsubscribe();
  }, []);

  // --- CART LOGIC ---
  const addToCart = (item) => {
    const finalPrice = (item.sale_price && item.sale_price < item.price) ? item.sale_price : item.price;
    const itemToAdd = { ...item, price: finalPrice }; 
    setCartItems([...cartItems, itemToAdd]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => { setCartItems(cartItems.filter((_, index) => index !== indexToRemove)); };
  const handleCheckout = () => { setCartItems([]); };

  /* --- SOCIAL PROOF SIMULATOR (COMMENTED OUT FOR FUTURE USE) ---
  useEffect(() => {
    // If store is closed, DO NOT show notifications
    if (!isStoreOpen) return;

    const locations = ['Westlands', 'Kilimani', 'Karen', 'CBD', 'Lavington', 'Ngong Road'];
    const items = ['The Maasai Giant', 'Spicy Chicken', 'Poussin Fries', 'Nyama Pizza', 'Dawa Mojito'];
    
    const triggerNotification = () => {
      const isOrder = Math.random() > 0.5;
      
      if (isOrder) {
        const randomLoc = locations[Math.floor(Math.random() * locations.length)];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-notsro-charcoal border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm pointer-events-none`}>
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Just Ordered</p>
              <p className="text-sm text-white">Someone in <span className="text-notsro-orange">{randomLoc}</span> bought a {randomItem}</p>
            </div>
          </div>
        ), { duration: 4000, position: 'bottom-left' });
      } else {
        const count = Math.floor(Math.random() * (45 - 15 + 1)) + 15;
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-notsro-charcoal border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm pointer-events-none`}>
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Live Traffic</p>
              <p className="text-sm text-white"><span className="text-blue-400 font-bold">{count} people</span> are viewing the menu right now.</p>
            </div>
          </div>
        ), { duration: 4000, position: 'bottom-left' });
      }
    };

    // Initial delay, then random intervals
    const timeout = setTimeout(() => {
      triggerNotification();
      
      const interval = setInterval(() => {
        triggerNotification();
      }, Math.random() * (40000 - 20000) + 20000);

      return () => clearInterval(interval);
    }, 5000); // Start 5 seconds after load

    return () => clearTimeout(timeout);
  }, [isStoreOpen]); // Dependency ensures it stops/starts based on store status
  */

  return (
    <BrowserRouter>
      <div className="bg-notsro-black min-h-screen text-notsro-cream selection:bg-notsro-orange selection:text-white font-sans">
        <ScrollToTop />
        
        <Toaster 
          position="top-center" 
          toastOptions={{ 
            style: { background: '#1F1F1F', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }, 
            success: { iconTheme: { primary: '#EA580C', secondary: '#fff' } } 
          }} 
        />

        {/* CLOSED BANNER */}
        {!isStoreOpen && (
          <div className="bg-red-600 text-white text-center py-2 px-4 font-bold text-xs uppercase tracking-widest sticky top-0 z-[70] flex items-center justify-center gap-2">
            <LockKeyhole className="w-4 h-4" /> We are currently closed. Orders are paused.
          </div>
        )}

        <LayoutWrapper 
          cartCount={cartItems.length} 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenReservation={() => setIsReservationOpen(true)}
        >
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route path="/menu" element={<FullMenu onAddToCart={addToCart} />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Footer Page Routes */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/gift-cards" element={<GiftCards />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/our-story" element={<OurStory />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </LayoutWrapper>
        
        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cartItems} 
          onRemove={removeFromCart} 
          onCheckout={handleCheckout} 
          isStoreOpen={isStoreOpen} 
        />
        <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

export default App;