import React, { useState, useRef, useEffect } from 'react';
import { WORLD_DATA, getCountryAtYear } from '../data/worldData';
import { Plus, Minus, Move } from 'lucide-react';

interface WorldMapProps {
  onSelect?: (countryId: string) => void;
  selectedCountryId?: string | null;
  controlledCountryIds?: string[];
  hoverEnabled?: boolean;
  enableZoom?: boolean;
  year?: number; // Optional year to render historical state
}

export const WorldMap: React.FC<WorldMapProps> = ({ 
  onSelect, 
  selectedCountryId, 
  controlledCountryIds = [], 
  hoverEnabled = true,
  enableZoom = false,
  year = 2024
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  
  // Zoom & Pan State
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoom = (delta: number) => {
    if (!enableZoom) return;
    setScale(prev => Math.min(Math.max(prev + delta, 1), 8)); // Min zoom 1x, Max 8x
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableZoom) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Tooltip logic
    if (hoverEnabled) {
       setTooltipPos({ x: e.clientX, y: e.clientY });
    }

    // Pan logic
    if (isDragging && enableZoom) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!enableZoom) return;
    e.stopPropagation();
    const delta = -Math.sign(e.deltaY) * 0.2;
    handleZoom(delta);
  };

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full bg-[#dbeafe] rounded-lg overflow-hidden relative border border-slate-800 ${enableZoom && isDragging ? 'cursor-grabbing' : enableZoom ? 'cursor-grab' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setHoveredCountry(null);
        setIsDragging(false);
      }}
      onWheel={handleWheel}
    >
      <svg
        viewBox="0 0 2000 1000"
        className="w-full h-full object-contain transition-transform duration-75 ease-out"
        style={{ 
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center'
        }}
      >
        {/* Ocean Background - Light Blue for Political Map Look */}
        <rect x="-5000" y="-5000" width="10000" height="10000" fill="#dbeafe" />

        {WORLD_DATA.map((baseCountry) => {
          const country = getCountryAtYear(baseCountry, year);

          if (!country.exists) {
            // Render non-existent countries as landmass but inactive
             return (
              <path
                key={country.id}
                d={country.path}
                fill="#94a3b8" // Slate 400 (Gray land)
                stroke="#64748b" // Slate 500
                strokeWidth={0.5 / scale}
                className="opacity-30"
              />
            );
          }

          const isSelected = selectedCountryId === country.id;
          const isControlled = controlledCountryIds.includes(country.id);
          
          let fill = country.mapColor || "#d1d5db"; // Default random map color
          let stroke = "#ffffff"; // White borders
          let strokeWidth = 0.5;

          if (isControlled) {
            fill = "#1d4ed8"; // Blue 700
            stroke = "#1e40af"; 
          }
          if (isSelected) {
            fill = "#2563eb"; // Blue 600
            stroke = "#1e3a8a"; 
            strokeWidth = 2;
          }

          // Highlight on hover
          if (hoverEnabled && hoveredCountry === country.name && !isSelected && !isControlled) {
            stroke = "#475569";
            strokeWidth = 1.5;
          }

          return (
            <g key={country.id}>
               <path
                d={country.path}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth / scale} // Keep stroke width consistent relative to screen
                vectorEffect="non-scaling-stroke" // Modern browser support
                className={`outline-none transition-all duration-200 cursor-pointer`}
                onClick={(e) => {
                    e.stopPropagation(); 
                    if (!isDragging && onSelect) onSelect(country.id);
                }}
                onMouseEnter={() => setHoveredCountry(country.name)}
              />
            </g>
          );
        })}
      </svg>
      
      {/* Zoom Controls */}
      {enableZoom && (
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button 
                onClick={() => handleZoom(0.5)}
                className="p-2 bg-slate-800/90 text-white rounded hover:bg-slate-700 border border-slate-600 shadow-lg backdrop-blur"
                title="Zoom In"
            >
                <Plus className="w-4 h-4" />
            </button>
            <button 
                onClick={() => handleZoom(-0.5)}
                className="p-2 bg-slate-800/90 text-white rounded hover:bg-slate-700 border border-slate-600 shadow-lg backdrop-blur"
                title="Zoom Out"
            >
                <Minus className="w-4 h-4" />
            </button>
        </div>
      )}

      {/* Tooltip */}
      {hoverEnabled && hoveredCountry && (
        <div 
            className="fixed pointer-events-none z-50 px-3 py-1 bg-slate-900/90 border border-slate-700 text-white text-xs rounded shadow-xl backdrop-blur-sm whitespace-nowrap"
            style={{ 
                left: tooltipPos.x + 15, 
                top: tooltipPos.y + 15 
            }}
        >
            {hoveredCountry}
        </div>
      )}
    </div>
  );
};