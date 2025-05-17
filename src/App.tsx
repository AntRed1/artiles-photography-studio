import React, { useState, useEffect } from 'react';
import Home from './pages/Home';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    window.addEventListener('load', handleLoad);
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => {
      window.removeEventListener('load', handleLoad);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 z-[100] transition-opacity duration-300 opacity-0 animate-[fadeIn_0.2s_ease-in_forwards]">
          <div className="w-16 h-16 relative bg-gray-50 rounded overflow-hidden">
            <div className="absolute left-0 bottom-0 w-10 h-10 rotate-45 translate-x-[30%] translate-y-[40%] bg-rose-600 shadow-[32px_-34px_0_5px_#9f1239] animate-[slide_2s_infinite_ease-in-out_alternate]"></div>
            <div className="absolute left-[10px] top-[10px] w-4 h-4 rounded-full bg-rose-800 transform-origin-[35px_145px] animate-[rotate_2s_infinite_ease-in-out]"></div>
          </div>
          <span className="mt-4 font-sans text-xl text-rose-600 font-semibold">
            Preparando tus momentos especiales...
          </span>
        </div>
      )}
      <Home />
    </div>
  );
};

export default App;
