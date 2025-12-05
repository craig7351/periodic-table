import React from 'react';
import { PeriodicElement } from '../types';
import { ELEMENTS } from '../constants';
import { ElementCard } from './ElementCard';

interface Props {
  onElementClick: (el: PeriodicElement) => void;
}

export const PeriodicTable: React.FC<Props> = ({ onElementClick }) => {
  return (
    <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
      <div 
        className="grid gap-2 min-w-[1000px] p-4 bg-nook-cream rounded-nook border-4 border-white shadow-xl mx-auto"
        style={{
          gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
          // Increased rows to 10 to accommodate the main body + gap + 2 rows of inner transition metals
          gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
        }}
      >
        {/* Render elements based on their xpos/ypos */}
        {ELEMENTS.map((el) => (
          <ElementCard 
            key={el.number} 
            element={el} 
            onClick={onElementClick} 
          />
        ))}
        
        {/* Decorative Title placed in the empty space top-center */}
        <div className="col-start-3 col-end-13 row-start-1 row-end-3 flex items-center justify-center text-nook-text opacity-30 pointer-events-none">
           <h2 className="text-4xl font-black tracking-widest uppercase rotate-[-5deg]">元素週期表</h2>
        </div>

        {/* Labels for the separated blocks (Optional decoration) */}
        <div className="col-start-1 col-end-3 row-start-9 row-end-10 flex items-end justify-end pb-2 pr-2 text-xs font-bold text-nook-text opacity-50">
          鑭系
        </div>
        <div className="col-start-1 col-end-3 row-start-10 row-end-11 flex items-end justify-end pb-2 pr-2 text-xs font-bold text-nook-text opacity-50">
          錒系
        </div>
      </div>
    </div>
  );
};