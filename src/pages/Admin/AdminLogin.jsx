import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const secret = import.meta.env.VITE_ADMIN_PASSWORD;

    if (password === secret) {
      localStorage.setItem('nostro_admin_auth', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Access Denied: Incorrect Password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-nostro-black flex flex-col items-center justify-center px-6 relative">
      
      {/* BACK BUTTON (Absolute position top left) */}
      <Link to="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/30 hover:text-nostro-orange transition">
        <ArrowLeft className="w-4 h-4" /> Back to Site
      </Link>

      <div className="w-full max-w-md bg-nostro-charcoal border border-white/10 p-8 rounded-3xl text-center shadow-2xl">
        <div className="w-20 h-20 bg-nostro-orange/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Lock className="w-10 h-10 text-nostro-orange" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-white mb-2">Staff Access</h2>
        <p className="text-white/50 mb-8">Restricted Area. Authorized Personnel Only.</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-white/30" />
            <input 
              type="password" 
              placeholder="Enter Security Code"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-nostro-orange focus:outline-none tracking-widest transition-all"
            />
          </div>
          <button className="w-full py-4 bg-nostro-orange hover:bg-orange-600 text-white font-bold rounded-xl transition shadow-glow uppercase tracking-widest text-sm">
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;