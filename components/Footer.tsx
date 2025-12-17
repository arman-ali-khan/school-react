import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FooterConfig } from '../types';

interface FooterProps {
    config: FooterConfig;
}

const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="mt-12 text-sm print:hidden">
      {/* Decorative Footer Top Image - Placed directly before the footer content */}
      <div className="w-full flex border-b-[15px] border-[#737272] justify-between sm:px-12 relative z-10 -mb-1">
        <img 
          src="https://res.cloudinary.com/dgituybrt/image/upload/v1765976701/footer_top_bg_2_gknwey.png" 
          alt="Bangladesh Landscape" 
          className="sm:w-52 w-24 h-6 sm:h-16 object-cover block"
        />
        <img 
          src="https://res.cloudinary.com/dgituybrt/image/upload/v1765976689/footer_top_bg_1_eami7b.png" 
          alt="Bangladesh Landscape" 
          className="sm:w-52 w-24 h-6 sm:h-16 object-cover block"
        />
      </div>

      <div className="bg-emerald-900 text-emerald-100 pt-8 relative z-20">
        {/* Top Footer */}
        <div className="container mx-auto px-4 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Contact Info */}
          <div>
              <h4 className="text-white font-bold text-lg mb-4 border-b border-emerald-700 pb-2 inline-block">Contact Address</h4>
              <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                      <MapPin size={18} className="mt-1 text-emerald-400 flex-shrink-0" />
                      <span className="whitespace-pre-line">
                          {config.address}
                      </span>
                  </li>
                  <li className="flex items-center gap-3">
                      <Phone size={18} className="text-emerald-400 flex-shrink-0" />
                      <span>{config.phone}</span>
                  </li>
                  <li className="flex items-center gap-3">
                      <Mail size={18} className="text-emerald-400 flex-shrink-0" />
                      <span>{config.email}</span>
                  </li>
              </ul>
          </div>

          {/* Govt Links */}
          <div>
              <h4 className="text-white font-bold text-lg mb-4 border-b border-emerald-700 pb-2 inline-block">{config.govtLinksTitle}</h4>
              <ul className="space-y-2">
                  {config.govtLinks.map((link, idx) => (
                      <li key={idx}>
                          <a href={link.href} className="hover:text-white hover:underline decoration-emerald-500">{link.label}</a>
                      </li>
                  ))}
              </ul>
          </div>

          {/* Visitor Stats (Static for now as per demo, but structurally ready) */}
          <div className="bg-emerald-950/50 p-4 rounded-lg border border-emerald-800">
              <h4 className="text-white font-bold mb-3">Visitor Statistics</h4>
              <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between border-b border-emerald-800/50 pb-1">
                      <span>Today:</span>
                      <span className="text-emerald-300">14,205</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800/50 pb-1">
                      <span>Yesterday:</span>
                      <span className="text-emerald-300">25,890</span>
                  </div>
                  <div className="flex justify-between border-b border-emerald-800/50 pb-1">
                      <span>This Month:</span>
                      <span className="text-emerald-300">452,100</span>
                  </div>
                  <div className="flex justify-between pt-1">
                      <span className="font-bold text-white">Total:</span>
                      <span className="font-bold text-emerald-300">89,120,453</span>
                  </div>
              </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-emerald-950 py-4 border-t border-emerald-800">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs opacity-80 gap-2">
              <p>{config.copyrightText}</p>
              <p>Developed with <span className="text-red-500">♥</span> by Engineering Team.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;