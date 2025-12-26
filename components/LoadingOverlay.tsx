
import React from 'react';

const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white/90 p-8 rounded-lg shadow-2xl flex flex-col items-center space-y-6 max-w-sm w-full border border-stone-200">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-stone-800 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-2xl">墨</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-stone-800 mb-2">大师正在审阅...</p>
          <p className="text-stone-600 animate-pulse">{message}</p>
        </div>
        <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
          <div className="bg-stone-800 h-full animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 50%; transform: translateX(50%); }
          100% { width: 0%; transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingOverlay;
