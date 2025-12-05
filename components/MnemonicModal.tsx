
import React from 'react';
import { Scroll, X, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface Props {
  onClose: () => void;
}

const MNEMONICS = [
  {
    group: "IA 族 (鹼金屬)",
    elements: "H, Li, Na, K, Rb, Cs, Fr",
    text: "請李娜加入私法",
    original: "氫鋰鈉鉀銣銫鍅",
    color: "bg-red-100 border-red-300 text-red-900"
  },
  {
    group: "IIA 族 (鹼土金屬)",
    elements: "Be, Mg, Ca, Sr, Ba, Ra",
    text: "比美蓋斯蓓蕾",
    original: "鈹鎂鈣鍶鋇鐳",
    color: "bg-orange-100 border-orange-300 text-orange-900"
  },
  {
    group: "IIIA 族 (硼族)",
    elements: "B, Al, Ga, In, Tl",
    text: "朋旅迦因他",
    original: "硼鋁鎵銦鉈",
    color: "bg-yellow-100 border-yellow-300 text-yellow-900"
  },
  {
    group: "IVA 族 (碳族)",
    elements: "C, Si, Ge, Sn, Pb",
    text: "探視者西遷",
    original: "碳矽鍺錫鉛",
    color: "bg-green-100 border-green-300 text-green-900"
  },
  {
    group: "VA 族 (氮族)",
    elements: "N, P, As, Sb, Bi",
    text: "蛋麟生悌必",
    original: "氮磷砷銻鉍",
    color: "bg-teal-100 border-teal-300 text-teal-900"
  },
  {
    group: "VIA 族 (氧族)",
    elements: "O, S, Se, Te, Po",
    text: "養牛洗蹄鋪",
    original: "氧硫硒碲釙",
    color: "bg-blue-100 border-blue-300 text-blue-900"
  },
  {
    group: "VIIA 族 (鹵素)",
    elements: "F, Cl, Br, I, At",
    text: "父女繡點惡",
    original: "氟氯溴碘砈",
    color: "bg-indigo-100 border-indigo-300 text-indigo-900"
  },
  {
    group: "VIIIA 族 (稀有氣體)",
    elements: "He, Ne, Ar, Kr, Xe, Rn",
    text: "害乃亞克先動",
    original: "氦氖氬氪氙氡",
    color: "bg-purple-100 border-purple-300 text-purple-900"
  }
];

export const MnemonicModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => { playClickSound(); onClose(); }}
    >
      <div 
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col bg-[#FFFDF0] rounded-3xl border-8 border-nook-tan shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
         {/* Header */}
         <div className="bg-nook-tan p-4 flex justify-between items-center shrink-0 border-b-4 border-[#C7B288]">
            <div className="flex items-center gap-3 px-2">
               <div className="bg-nook-orange text-white p-2 rounded-full shadow-sm">
                  <Scroll size={20} />
               </div>
               <div>
                 <h3 className="font-black text-white text-xl tracking-widest drop-shadow-md">快樂背誦口訣</h3>
                 <p className="text-white/80 text-xs font-bold">動森風格記憶法，輕鬆記住元素表！</p>
               </div>
            </div>
            <button 
              onClick={() => { playClickSound(); onClose(); }}
              className="bg-white text-nook-tan p-2 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors shadow-sm"
            >
              <X size={24} />
            </button>
         </div>

         {/* Content Container */}
         <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-[#FFFDF0]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {MNEMONICS.map((item, index) => (
                <div 
                  key={index} 
                  className={`
                    relative p-5 rounded-2xl border-4 shadow-sm hover:shadow-md transition-transform hover:-translate-y-1 group
                    ${item.color}
                  `}
                >
                  <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100 transition-opacity text-current">
                    <Sparkles size={16} />
                  </div>
                  
                  <h4 className="font-black text-lg mb-1 opacity-80">{item.group}</h4>
                  <p className="text-xs font-bold opacity-60 mb-3">{item.elements}</p>
                  
                  <div className="bg-white/60 p-3 rounded-xl backdrop-blur-sm">
                    <p className="text-xl font-black mb-1 text-nook-text tracking-wider">{item.text}</p>
                    <p className="text-xs text-nook-text/50 font-medium">({item.original})</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center bg-white/50 p-4 rounded-xl border-2 border-nook-tan/30">
              <p className="text-nook-text font-bold text-sm">
                💡 小撇步：把這些口訣編成一首歌，或是想像成島民的對話，會更容易記住喔！
              </p>
            </div>
         </div>
         
         <div className="bg-[#E6D7B5] p-2 text-center text-xs text-[#7C5C38]/60 font-bold shrink-0">
            點擊空白處或右上角關閉
         </div>
      </div>
    </div>
  );
};
