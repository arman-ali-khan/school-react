import React from 'react';
import { HomeWidgetConfig } from '../types';

interface HomeWidgetProps {
    config: HomeWidgetConfig;
}

const HomeWidget: React.FC<HomeWidgetProps> = ({ config }) => {
  
  const renderContent = () => {
    switch (config.type) {
        case 'youtube':
            let src = config.url;
            // Simple check to convert watch URL to embed URL if user pasted standard link
            if (src.includes('watch?v=')) {
                src = src.replace('watch?v=', 'embed/');
                // Remove any additional query params for simplicity or handle them if needed
                const ampersandIndex = src.indexOf('&');
                if (ampersandIndex !== -1) {
                    src = src.substring(0, ampersandIndex);
                }
            } else if (src.includes('youtu.be/')) {
                 src = src.replace('youtu.be/', 'www.youtube.com/embed/');
            }
            return (
                <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={src} 
                  title={config.title}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
            );
        case 'map':
            return (
                 <iframe 
                  className="absolute top-0 left-0 w-full h-full"
                  src={config.url}
                  title={config.title} 
                  style={{ border: 0 }} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            );
        case 'image':
            return <img src={config.url} alt={config.title} className="absolute top-0 left-0 w-full h-full object-cover" />;
        case 'video':
             return (
                <video className="absolute top-0 left-0 w-full h-full object-cover" controls>
                    <source src={config.url} />
                    Your browser does not support the video tag.
                </video>
             );
        default:
            return <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500">Invalid Content Type</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden transition-colors mb-6 last:mb-0">
      <div className="bg-emerald-700 dark:bg-emerald-800 text-white p-2.5 px-4">
        <h3 className="font-bold text-sm">{config.title}</h3>
      </div>
      
      <div className="relative pb-[56.25%] h-0 bg-gray-100 dark:bg-gray-900">
        {renderContent()}
      </div>
    </div>
  );
};

export default HomeWidget;