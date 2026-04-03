'use client';
import { useState } from 'react';
import { useDevMode } from '@/context/DevModeContext';

interface Props {
  source: string;
  tech: string;
  children: React.ReactNode;
}

export default function DataSourceTooltip({ source, tech, children }: Props) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const { isDevMode } = useDevMode();

  return (
    <div 
      className={`relative group ${isDevMode ? 'cursor-crosshair' : ''}`}
      onMouseMove={(e) => setCoords({ x: e.clientX + 15, y: e.clientY + 15 })}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Adds a subtle red outline to the section when Dev Mode is on and hovered */}
      <div className={`transition-all duration-300 ${isDevMode && visible ? 'ring-1 ring-red-500/50 rounded' : ''}`}>
        {children}
      </div>
      
      {/* 3. ONLY show the tooltip if BOTH hover is true AND DevMode is ON */}
      {isDevMode && visible && (
        <div 
          className="fixed z-[9999] pointer-events-none bg-black/95 border border-red-500/50 p-3 rounded shadow-[0_0_15px_rgba(239,68,68,0.2)] backdrop-blur-md min-w-[150px]"
          style={{ left: coords.x, top: coords.y }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Source</p>
          </div>
          <p className="text-sm font-black text-white uppercase tracking-tight">{source}</p>
          <p className="text-[11px] text-red-400 mt-1 font-mono">{tech}</p>
        </div>
      )}
    </div>
  );
}