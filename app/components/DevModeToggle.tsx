'use client';
import { useDevMode } from '@/context/DevModeContext';

export default function DevModeToggle() {
  const { isDevMode, toggleDevMode } = useDevMode();

  return (
    <button 
      onClick={toggleDevMode}
      className="flex items-center gap-3 cursor-pointer group"
      aria-pressed={isDevMode}
      aria-label="Toggle Architecture View"
    >
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
        isDevMode ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-300'
      }`}>
        Architecture View
      </span>
      
      {/* The background track of the switch */}
      <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${
        isDevMode ? 'bg-red-600' : 'bg-[#1a1a1a] border border-white/10'
      }`}>
        {/* The animated sliding dot */}
        <div 
          className={`absolute top-[1px] w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
            isDevMode ? 'translate-x-[22px]' : 'translate-x-[2px]'
          }`} 
        />
      </div>
    </button>
  );
}