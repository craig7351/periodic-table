import React from 'react';
import { PeriodicElement } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { 
  Cloud, 
  Sparkles, 
  Flame, 
  Mountain, 
  Cpu, 
  Hexagon, 
  Hammer, 
  Shield, 
  Gem, 
  Zap,
  Circle
} from 'lucide-react';

interface Props {
  element: PeriodicElement;
  onClick: (element: PeriodicElement) => void;
  isDimmed?: boolean;
}

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "雙原子非金屬": return Cloud;
    case "稀有氣體": return Sparkles;
    case "鹼金屬": return Flame;
    case "鹼土金屬": return Mountain;
    case "類金屬": return Cpu;
    case "多原子非金屬": return Hexagon;
    case "後過渡金屬": return Hammer;
    case "過渡金屬": return Shield;
    case "鑭系元素": return Gem;
    case "錒系元素": return Zap;
    default: return Circle;
  }
};

export const ElementCard: React.FC<Props> = ({ element, onClick, isDimmed = false }) => {
  const colorClass = CATEGORY_COLORS[element.category] || "bg-gray-200 border-gray-400 text-gray-800";
  const Icon = getCategoryIcon(element.category);

  return (
    <button
      onClick={() => !isDimmed && onClick(element)}
      disabled={isDimmed}
      className={`
        relative flex flex-col items-center justify-center p-1 sm:p-2 
        border-b-4 border-r-4 rounded-xl 
        w-full h-full min-h-[60px] sm:min-h-[80px]
        transition-all duration-200 overflow-hidden
        ${isDimmed 
          ? 'opacity-10 grayscale cursor-default border-gray-300 bg-gray-200 text-gray-400' 
          : `${colorClass} shadow-sm hover:shadow-md active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1`
        }
      `}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
      }}
    >
      {/* Category Icon Background - Moved to bottom right and sized smaller */}
      <Icon 
        className="absolute bottom-1 right-1 w-3 h-3 sm:w-4 sm:h-4 opacity-40 text-current pointer-events-none z-0" 
        strokeWidth={2.5}
      />

      <span className="text-[10px] sm:text-xs font-bold absolute top-1 left-2 opacity-70 z-10">
        {element.number}
      </span>
      <span className="text-lg sm:text-2xl font-black tracking-tight z-10 relative">
        {element.symbol}
      </span>
      {/* Ensure text is above the icon with z-10 */}
      <span className="text-[8px] sm:text-[10px] truncate w-full text-center font-medium hidden sm:block z-10 relative">
        {element.name}
      </span>
    </button>
  );
};