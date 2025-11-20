import React from 'react';
import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom'; // <--- THIS IMPORT IS CRITICAL

const Footer = () => {
  return (
    <footer id="locations" className="bg-nostro-black border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-3xl font-serif font-bold text-white mb-6">
              NOSTRO<span className="text-nostro-orange">.</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Defining the premium fast-casual experience in Nairobi. Bold flavors, fresh ingredients, zero compromise.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-nostro-orange hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-nostro-orange hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-nostro-orange hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column - FIXED LINKS */}
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/50 text-sm">
              <li>
                <Link to="/menu" className="hover:text-nostro-orange transition">Full Menu</Link>
              </li>
              <li>
                <Link to="/gift-cards" className="hover:text-nostro-orange transition">Gift Cards</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-nostro-orange transition">Careers</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-nostro-orange transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-nostro-orange transition">Staff Access</Link>
              </li>
            </ul>
          </div>

          {/* Locations Column */}
          <div>
            <h4 className="text-white font-bold mb-6">Locations</h4>
            <ul className="space-y-6 text-white/50 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-nostro-orange shrink-0" />
                <div>
                  <span className="block text-white font-medium">Ngong</span>
                  <span>Zambia, Uptown Mall</span>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-nostro-orange shrink-0" />
                <div>
                  <span className="block text-white font-medium">Kilimani</span>
                  <span>Yaya Center, Food Court</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours Column */}
          <div>
            <h4 className="text-white font-bold mb-6">Opening Hours</h4>
            <div className="space-y-3 text-white/50 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Mon - Thu</span>
                <span className="text-white">10:00 AM - 10:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Fri - Sat</span>
                <span className="text-white">10:00 AM - 02:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span>Sunday</span>
                <span className="text-white">10:00 AM - 11:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>© 2025 Nostro Kenya. All rights reserved.</p>
          <p>Designed for the Bold.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;