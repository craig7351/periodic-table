
import React, { useState, useEffect } from 'react';
import { PeriodicTable } from './components/PeriodicTable';
import { ElementDetailModal } from './components/ElementDetailModal';
import { QuizView } from './components/QuizView';
import { GuestbookModal } from './components/GuestbookModal';
import { MnemonicModal } from './components/MnemonicModal';
import { PeriodicElement, AppView } from './types';
import { BookOpen, Search, Leaf, Gauge, MessageCircle } from 'lucide-react';
import { speak } from './utils/tts';
import { playSelectSound } from './utils/sound';
import { initializeVisitorCounter, subscribeToVisitorCount } from './services/guestbookService';

export default function App() {
  const [view, setView] = useState<AppView>('table');
  const [selectedElement, setSelectedElement] = useState<PeriodicElement | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [showGuestbook, setShowGuestbook] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  useEffect(() => {
    // Initialize visitor counter on app load
    initializeVisitorCounter();
    
    // Subscribe to live updates
    const unsubscribe = subscribeToVisitorCount((count) => {
      setVisitorCount(count);
    });

    return () => unsubscribe();
  }, []);

  const handleElementClick = (element: PeriodicElement) => {
    speak(element.name, speechRate);
    setSelectedElement(element);
  };

  const handleViewChange = (newView: AppView) => {
    playSelectSound();
    setView(newView);
  };

  const toggleSpeed = () => {
    playSelectSound();
    // Cycle: Normal (0.9) -> Fast (1.2) -> Slow (0.7) -> Normal
    if (speechRate === 0.9) setSpeechRate(1.2);
    else if (speechRate === 1.2) setSpeechRate(0.7);
    else setSpeechRate(0.9);
  };

  const getSpeedLabel = () => {
    if (speechRate === 0.9) return "語速: 正常";
    if (speechRate > 1.0) return "語速: 快";
    return "語速: 慢";
  };

  return (
    <div className="min-h-screen font-sans text-nook-text selection:bg-nook-green selection:text-white flex flex-col">
      
      {/* Navbar - Styled like a NookPhone Header or AC Menu */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-white/80 backdrop-blur-md border-b-4 border-nook-green/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2 text-nook-green cursor-pointer" onClick={() => handleViewChange('table')}>
            <div className="bg-nook-green text-white p-2 rounded-full shadow-sm">
              <Leaf size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black tracking-tight hidden sm:block">貍克的元素表</h1>
          </div>

          <nav className="flex gap-2 bg-gray-100/50 p-1 rounded-full items-center">
            <button 
              onClick={() => handleViewChange('table')}
              className={`
                px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2
                ${view === 'table' ? 'bg-white shadow-sm text-nook-green' : 'text-gray-500 hover:text-nook-text'}
              `}
            >
              <Search size={16} />
              <span className="hidden sm:inline">探索</span>
            </button>
            <button 
              onClick={() => handleViewChange('quiz')}
              className={`
                px-4 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2
                ${view === 'quiz' ? 'bg-white shadow-sm text-nook-orange' : 'text-gray-500 hover:text-nook-text'}
              `}
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">測驗</span>
            </button>
            <div className="w-px bg-gray-300 mx-1 my-2 h-6"></div>
            
            {/* Speed Toggle */}
            <button 
              onClick={toggleSpeed}
              className={`
                px-3 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2
                text-gray-500 hover:text-nook-text hover:bg-white hover:shadow-sm
              `}
              title="切換語音速度"
            >
              <Gauge size={16} />
              <span className="hidden sm:inline">{getSpeedLabel()}</span>
            </button>

             {/* Guestbook Button */}
             <button 
              onClick={() => { playSelectSound(); setShowGuestbook(true); }}
              className={`
                bg-nook-yellow text-nook-text px-4 py-2 rounded-full font-black text-sm transition-all flex items-center gap-2
                hover:bg-yellow-300 border-2 border-white shadow-sm ml-2
              `}
            >
              <MessageCircle size={16} />
              <span>留言板 ({visitorCount})</span>
            </button>

          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 px-2 sm:px-6 relative">
        
        {/* View Switcher */}
        {view === 'table' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-8">
               <h2 className="text-3xl sm:text-4xl font-black text-nook-text mb-2 drop-shadow-sm text-stroke-white">
                 無人島化學
               </h2>
               <p className="text-nook-text opacity-70 font-medium bg-white/40 inline-block px-4 py-1 rounded-full">
                 點擊元素來了解更多！
               </p>
             </div>
             <PeriodicTable 
               onElementClick={handleElementClick} 
               onOpenMnemonic={() => setShowMnemonic(true)}
             />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
             <div className="text-center mb-8">
               <h2 className="text-3xl sm:text-4xl font-black text-nook-text mb-2">
                 每日評估
               </h2>
               <p className="text-nook-text opacity-70 font-medium">
                 向傅達證明你的知識！
               </p>
             </div>
             <QuizView />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-nook-text/40 text-sm font-bold">
        <p>用 🍃 為了科學製作。</p>
        <p className="mt-2 text-xs opacity-60">
          作者: BOOK (<a href="mailto:craig7351@gmail.com" className="hover:text-nook-blue hover:underline">craig7351@gmail.com</a>)
        </p>
      </footer>

      {/* Modals */}
      {selectedElement && (
        <ElementDetailModal 
          element={selectedElement} 
          onClose={() => setSelectedElement(null)} 
          speechRate={speechRate}
        />
      )}

      {showGuestbook && (
        <GuestbookModal 
          onClose={() => setShowGuestbook(false)} 
          visitorCount={visitorCount} 
        />
      )}

      {showMnemonic && (
        <MnemonicModal 
          onClose={() => setShowMnemonic(false)}
        />
      )}

    </div>
  );
}
