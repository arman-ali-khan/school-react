
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselItem } from '../../types';

interface HeroSliderProps {
  items: CarouselItem[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  if (!items.length) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-2xl shadow-xl bg-slate-200 dark:bg-slate-800 group border-4 border-white dark:border-gray-800">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className={`absolute inset-0 transition-all duration-1000 ease-out transform ${
            index === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
          }`}
        >
          <img 
            src={item.image} 
            alt={item.caption} 
            className="w-full h-full object-cover select-none" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
            <div className="p-8 md:p-12 w-full">
               <p className="text-white text-xl md:text-3xl font-bold tracking-tight drop-shadow-lg leading-tight max-w-2xl animate-fade-in-up">
                 {item.caption}
               </p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {items.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'w-2 bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all">
        <ChevronLeft size={24} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all">
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default HeroSlider;
