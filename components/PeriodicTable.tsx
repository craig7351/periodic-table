import React, { useState } from 'react';
import { PeriodicElement } from '../types';
import { ELEMENTS, CATEGORY_COLORS } from '../constants';
import { ElementCard, getCategoryIcon } from './ElementCard';
import { Info, Filter, ChevronDown, ArrowLeftRight } from 'lucide-react';
import { playSelectSound, playClickSound } from '../utils/sound';

interface Props {
  onElementClick: (el: PeriodicElement) => void;
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "鹼金屬": "活性強，易燃",
  "鹼土金屬": "存在於地殼岩石中",
  "過渡金屬": "堅固、金屬特性強",
  "稀有氣體": "發光、高貴",
  "雙原子非金屬": "氣體",
  "多原子非金屬": "結構、碳化學",
  "類金屬": "半導體原料",
  "後過渡金屬": "金屬加工",
  "鑭系元素": "稀土礦物",
  "錒系元素": "放射性/能量",
};

export const PeriodicTable: React.FC<Props> = ({ onElementClick }) => {
  const [showLegend, setShowLegend] = useState(false);
  const [activeCategory, setActiveCategory] = useState("全部");
  const [hoverCategory, setHoverCategory] = useState<string | null>(null);
  const [showNameAsPrimary, setShowNameAsPrimary] = useState(false);

  const toggleLegend = () => {
    playSelectSound();
    setShowLegend(!showLegend);
  };

  const togglePrimaryDisplay = () => {
    playSelectSound();
    setShowNameAsPrimary(!showNameAsPrimary);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    playSelectSound();
    setActiveCategory(e.target.value);
  };

  const handleCategoryClick = (category: string) => {
    playClickSound();
    // Toggle: if clicking the active one, revert to "All"
    setActiveCategory(activeCategory === category ? "全部" : category);
  };

  const categories = ["全部", ...Object.keys(CATEGORY_COLORS)];
  
  // Determine which category is currently effectively active (for visual highlighting)
  // Hover takes precedence over selection for preview purposes
  const effectiveFilter = hoverCategory || (activeCategory === "全部" ? null : activeCategory);

  return (
    <div className="relative w-full">
      {/* Controls: Filter & Legend Toggle */}
      <div className="flex flex-wrap gap-3 justify-between items-center max-w-[1000px] mx-auto mb-4 px-4">
        
        {/* Category Filter Dropdown */}
        <div className="relative group flex-1 sm:flex-none">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-nook-text pointer-events-none">
            <Filter size={18} />
          </div>
          <select
            value={activeCategory}
            onChange={handleFilterChange}
            className="w-full sm:w-auto appearance-none pl-10 pr-10 py-2 bg-white border-2 border-nook-tan rounded-full text-nook-text font-bold shadow-sm cursor-pointer hover:border-nook-green focus:outline-none focus:ring-2 focus:ring-nook-green/50 transition-all min-w-[160px]"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-nook-text pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="flex gap-2">
            {/* Toggle Name/Symbol Button */}
            <button 
              onClick={togglePrimaryDisplay}
              className={`
                flex items-center gap-2 bg-white px-3 py-2 md:px-5 md:py-2 rounded-full 
                text-nook-text font-bold shadow-sm border-2 border-nook-tan 
                hover:bg-nook-blue hover:border-white hover:text-white 
                transition-all transform active:scale-95
              `}
              aria-label="切換顯示"
              title="切換中文/英文顯示優先級"
            >
              <ArrowLeftRight size={18} />
              <span className="hidden md:inline">{showNameAsPrimary ? "顯示英文" : "顯示中文"}</span>
            </button>

            <button 
              onClick={toggleLegend}
              className={`
                flex items-center gap-2 bg-white px-3 py-2 md:px-5 md:py-2 rounded-full 
                text-nook-text font-bold shadow-sm border-2 border-nook-tan 
                hover:bg-nook-yellow hover:border-white hover:text-white 
                transition-all transform active:scale-95
                ${showLegend ? 'bg-nook-yellow border-white text-white ring-2 ring-nook-yellow/50' : ''}
              `}
              aria-label="分類說明"
            >
              <Info size={18} />
              <span className="hidden md:inline">分類說明</span>
            </button>
        </div>
      </div>

      {/* Collapsible Interactive Legend Panel */}
      <div 
        className={`
          w-full max-w-[1000px] mx-auto px-4 transition-all duration-300 ease-in-out overflow-hidden
          ${showLegend ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}
        `}
      >
        <div className="bg-nook-cream border-4 border-white rounded-nook p-6 shadow-inner relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-nook-tan/20"></div>
            
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-nook-text flex items-center gap-2">
                    <span className="bg-nook-green text-white rounded-full p-1"><Info size={14} /></span>
                    元素分類指南
                </h3>
                <p className="text-xs text-nook-text/60 font-bold hidden sm:block">
                    試著把滑鼠移上去預覽，或點擊直接篩選！
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(CATEGORY_COLORS).map(([category, classes]) => {
                  const Icon = getCategoryIcon(category);
                  const description = CATEGORY_DESCRIPTIONS[category] || "";

                  return (
                    <button 
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        onMouseEnter={() => setHoverCategory(category)}
                        onMouseLeave={() => setHoverCategory(null)}
                        className={`
                            flex items-center gap-3 p-2 rounded-xl border-2 transition-all text-left
                            ${activeCategory === category 
                                ? 'bg-white border-nook-green shadow-md scale-105 ring-2 ring-nook-green/20' 
                                : 'bg-white/50 border-transparent hover:bg-white hover:border-nook-tan hover:shadow-sm'
                            }
                        `}
                    >
                        {/* Visual color dot with Icon inside */}
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border shadow-sm shrink-0 flex items-center justify-center ${classes.split(' ')[0]}`}>
                            <Icon size={16} className="text-current opacity-70" />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-xs sm:text-sm font-bold text-nook-text truncate leading-tight">{category}</span>
                           <span className="text-[10px] text-nook-text/60 font-bold truncate">{description}</span>
                        </div>
                    </button>
                  );
              })}
            </div>
            
            <div className="mt-3 text-center sm:hidden">
              <p className="text-xs text-nook-text/40 font-bold">點擊按鈕來篩選類別</p>
            </div>
        </div>
      </div>

      {/* Main Table Scroll Container */}
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar">
        <div 
          className="grid gap-2 min-w-[1000px] p-4 bg-nook-cream rounded-nook border-4 border-white shadow-xl mx-auto"
          style={{
            gridTemplateColumns: 'repeat(18, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(10, minmax(0, 1fr))'
          }}
        >
          {ELEMENTS.map((el) => {
            // Determine if element should be dimmed based on effective filter (hover or active)
            const isDimmed = effectiveFilter !== null && el.category !== effectiveFilter;
            
            return (
              <ElementCard 
                key={el.number} 
                element={el} 
                onClick={onElementClick}
                isDimmed={isDimmed}
                showNameAsPrimary={showNameAsPrimary}
              />
            );
          })}
          
          {/* Decorative Title */}
          <div className="col-start-3 col-end-13 row-start-1 row-end-3 flex items-center justify-center text-nook-text opacity-30 pointer-events-none">
             <h2 className="text-4xl font-black tracking-widest uppercase rotate-[-5deg]">元素週期表</h2>
          </div>

          {/* Labels */}
          <div className="col-start-1 col-end-3 row-start-9 row-end-10 flex items-end justify-end pb-2 pr-2 text-xs font-bold text-nook-text opacity-50">
            鑭系
          </div>
          <div className="col-start-1 col-end-3 row-start-10 row-end-11 flex items-end justify-end pb-2 pr-2 text-xs font-bold text-nook-text opacity-50">
            錒系
          </div>
        </div>
      </div>
    </div>
  );
};