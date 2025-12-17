
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselItem } from '../../types/index';

interface HeroSliderProps {
    items: CarouselItem[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ items }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (current >= items.length) {
        setCurrent(0);
    }
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const next = () => setCurrent((prev) => (prev + 1) % items.length);
  const prev = () => setCurrent((prev) => (prev - 1 + items.length) % items.length);

  if (items.length === 0) return <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">No slides configured</div>;

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-md border-2 border-white group bg-gray-200 dark:bg-gray-700">
      {items.map((item, index) => (
        <div key={item.id} className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={item.image} alt={item.caption} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6"><p className="text-white text-lg font-medium drop-shadow-md">{item.caption}</p></div>
        </div>
      ))}
      {items.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"><ChevronLeft size={24} /></button>
            <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={24} /></button>
            <div className="absolute bottom-2 right-4 flex gap-2">
                {items.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrent(idx)} className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === current ? 'bg-emerald-500' : 'bg-white/50 hover:bg-white'}`}/>
                ))}
            </div>
          </>
      )}
    </div>
  );
};

export default HeroSlider;
