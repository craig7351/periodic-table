import React, { useEffect, useState } from 'react';
import { PeriodicElement } from '../types';
import { generateVillagerExplanation } from '../services/geminiService';
import { X, Sparkles, Beaker, Volume2, Youtube } from 'lucide-react';
import { CATEGORY_COLORS } from '../constants';
import { speak } from '../utils/tts';
import { ELEMENT_VIDEOS } from '../elementVideos';

interface Props {
  element: PeriodicElement | null;
  onClose: () => void;
  speechRate?: number;
}

export const ElementDetailModal: React.FC<Props> = ({ element, onClose, speechRate = 0.9 }) => {
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (element) {
      setLoading(true);
      setExplanation(""); // Clear previous
      generateVillagerExplanation(element).then(text => {
        setExplanation(text);
        setLoading(false);
      });
    }
  }, [element]);

  if (!element) return null;

  const colorClass = CATEGORY_COLORS[element.category] || "bg-gray-100";
  // Extract just the background color for the header
  const headerColor = colorClass.split(' ')[0];
  const videoUrl = ELEMENT_VIDEOS[element.number];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-nook-cream border-8 border-white rounded-nook shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className={`${headerColor} p-6 flex justify-between items-start relative`}>
           {/* Decorative pattern overlay */}
           <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           
           <div className="relative z-10 flex gap-4 items-center">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md text-3xl font-black text-nook-text shrink-0">
               {element.symbol}
             </div>
             <div className="flex flex-col items-start min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                 <h2 className="text-3xl font-black text-nook-text">{element.name}</h2>
                 
                 <div className="flex gap-1">
                   <button 
                     onClick={(e) => {
                       e.stopPropagation();
                       speak(element.name, speechRate);
                     }}
                     className="p-2 bg-white/30 hover:bg-white/60 rounded-full text-nook-text transition-colors"
                     aria-label="發音"
                   >
                     <Volume2 size={20} />
                   </button>
                   
                   {videoUrl && videoUrl !== "Not Found" && (
                     <a 
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white/30 hover:bg-[#FF0000] hover:text-white rounded-full text-[#FF0000] transition-colors"
                        aria-label="觀看影片"
                        title="觀看 YouTube 介紹"
                     >
                       <Youtube size={20} />
                     </a>
                   )}
                 </div>
               </div>
               <span className="inline-block px-3 py-1 bg-white/50 rounded-full text-sm font-bold text-nook-text mt-1">
                 編號 {element.number}
               </span>
             </div>
           </div>
           
           <button 
             onClick={onClose}
             className="relative z-10 p-2 bg-white rounded-full hover:bg-red-100 text-nook-text transition-colors shadow-sm shrink-0"
           >
             <X size={24} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-nook-tan/30 p-3 rounded-2xl flex items-center gap-2">
              <Beaker className="text-nook-blue" size={20} />
              <div>
                <p className="text-xs text-nook-text opacity-70 font-bold uppercase">原子量</p>
                <p className="font-bold text-nook-text">{element.atomic_mass}</p>
              </div>
            </div>
            <div className="bg-nook-tan/30 p-3 rounded-2xl flex items-center gap-2">
              <Sparkles className="text-nook-yellow" size={20} />
              <div>
                <p className="text-xs text-nook-text opacity-70 font-bold uppercase">類別</p>
                <p className="font-bold text-nook-text text-sm truncate">{element.category}</p>
              </div>
            </div>
          </div>

          {/* Villager Chat Bubble */}
          <div className="relative">
            <div className="bg-white border-4 border-nook-tan rounded-3xl p-5 shadow-sm relative z-10">
              <h3 className="text-nook-green font-black text-lg mb-2 flex items-center gap-2">
                 島民筆記
                 {loading && <span className="animate-spin">🍃</span>}
              </h3>
              
              {loading ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-nook-bg rounded w-3/4"></div>
                  <div className="h-4 bg-nook-bg rounded w-full"></div>
                  <div className="h-4 bg-nook-bg rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-nook-text leading-relaxed font-medium">
                  {explanation}
                </p>
              )}
            </div>
            {/* Triangle for speech bubble */}
            <div className="w-6 h-6 bg-white border-b-4 border-r-4 border-nook-tan absolute -bottom-3 left-8 rotate-45 z-0"></div>
          </div>

          <div className="mt-8 flex justify-center">
             <button 
                onClick={onClose}
                className="bg-nook-blue hover:bg-blue-400 text-white font-bold py-3 px-8 rounded-full shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all"
             >
               好喔！
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};