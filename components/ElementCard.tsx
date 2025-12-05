import React from 'react';
import { PeriodicElement, ElementCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface Props {
  element: PeriodicElement;
  onClick: (element: PeriodicElement) => void;
}

export const ElementCard: React.FC<Props> = ({ element, onClick }) => {
  const colorClass = CATEGORY_COLORS[element.category] || "bg-gray-200 border-gray-400 text-gray-800";

  return (
    <button
      onClick={() => onClick(element)}
      className={`
        relative flex flex-col items-center justify-center p-1 sm:p-2 
        border-b-4 border-r-4 active:border-b-0 active:border-r-0 active:translate-y-1 active:translate-x-1
        rounded-xl shadow-sm hover:shadow-md transition-all duration-100
        w-full h-full min-h-[60px] sm:min-h-[80px]
        ${colorClass}
      `}
      style={{
        gridColumn: element.xpos,
        gridRow: element.ypos,
      }}
    >
      <span className="text-[10px] sm:text-xs font-bold absolute top-1 left-2 opacity-70">
        {element.number}
      </span>
      <span className="text-lg sm:text-2xl font-black tracking-tight">
        {element.symbol}
      </span>
      <span className="text-[8px] sm:text-[10px] truncate w-full text-center font-medium hidden sm:block">
        {element.name}
      </span>
    </button>
  );
};
