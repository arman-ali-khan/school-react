import React from 'react';
import { Play } from 'lucide-react';

const GoldenJubileeCorner: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden font-sans">
      <div className="bg-[#f3f4f6] p-2.5 border-b border-gray-200">
        <h3 className="font-bold text-gray-800 text-sm">স্বাধীনতার সুবর্ণজয়ন্তী</h3>
      </div>
      <div className="p-3 flex gap-3 items-start">
        <div className="w-5/12 pt-1">
            <img 
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Golden_Jubilee_of_Bangladesh_Independence_Logo.svg/240px-Golden_Jubilee_of_Bangladesh_Independence_Logo.svg.png" 
             alt="Golden Jubilee 50" 
             className="w-full h-auto object-contain"
           />
        </div>
        <div className="w-7/12">
          <ul className="space-y-2">
            {[
                { text: 'আদেশ/নোটিশ', href: '#' },
                { text: 'কার্যক্রম', href: '#' },
                { text: 'ছবি গ্যালারি', href: '#' },
                { text: 'ভিডিও', href: '#' }
            ].map((item, idx) => (
              <li key={idx}>
                <a href={item.href} className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-emerald-700 transition-colors group">
                  <Play size={8} className="text-emerald-600 fill-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>{item.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoldenJubileeCorner;