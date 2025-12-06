
import React, { useState, useEffect } from 'react';
import { LocalQuizQuestion, PeriodicElement } from '../types';
import { ELEMENTS } from '../constants';
import { CheckCircle, XCircle, Trophy, RefreshCw, Settings2, Play, ArrowRight, Home, LayoutGrid, CheckSquare, Languages } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound, playSelectSound } from '../utils/sound';
import { QUIZ_RANDOM } from '../data/quiz_random';
import { QUIZ_SYMBOLS } from '../data/quiz_symbols';

const QUIZ_TOPICS = ["隨機", "原子序與符號"];
const QUIZ_LENGTHS = [10, 30, 100];

type QuizState = 'menu' | 'selector' | 'playing' | 'finished';

export const QuizView: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('menu');
  const [topic, setTopic] = useState<string>("隨機");
  const [quizMode, setQuizMode] = useState<"standard" | "english-chinese">("standard");
  const [targetLength, setTargetLength] = useState<number>(10);
  
  const [questions, setQuestions] = useState<LocalQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Selector State
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [selectedTransitionRows, setSelectedTransitionRows] = useState<number[]>([]);
  const [selectedInnerRows, setSelectedInnerRows] = useState<string[]>([]); // 'lanthanide', 'actinide'

  const handleTopicSelect = (t: string) => {
    playClickSound();
    setTopic(t);
  };

  const handleLengthSelect = (len: number) => {
    playClickSound();
    setTargetLength(len);
  };

  const startStandardQuiz = () => {
    playSelectSound();
    setQuizMode("standard");
    
    // Select Source Data
    let sourceData = topic === "隨機" ? QUIZ_RANDOM : QUIZ_SYMBOLS;
    
    // Shuffle Data
    const shuffled = [...sourceData].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, targetLength);
    
    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizState('playing');
  };

  const openSelector = () => {
    playSelectSound();
    setQuizMode("english-chinese");
    // Reset selection
    setSelectedGroups([]);
    setSelectedTransitionRows([]);
    setSelectedInnerRows([]);
    setQuizState('selector');
  };

  const toggleGroup = (group: number) => {
    playClickSound();
    setSelectedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const toggleTransitionRow = (row: number) => {
    playClickSound();
    setSelectedTransitionRows(prev => 
      prev.includes(row) ? prev.filter(r => r !== row) : [...prev, row]
    );
  };

  const toggleInnerRow = (type: string) => {
    playClickSound();
    setSelectedInnerRows(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const startEnglishQuiz = () => {
    playSelectSound();
    
    // Filter Elements based on selection
    const pool = ELEMENTS.filter(el => {
      // Main Groups (1, 2, 13-18) check xpos
      if (selectedGroups.includes(el.xpos) && (el.xpos <= 2 || el.xpos >= 13) && el.ypos <= 7) return true;
      
      // Transition Metals (xpos 3-12) check ypos (row)
      const isTransitionCol = el.xpos >= 3 && el.xpos <= 12;
      if (isTransitionCol && selectedTransitionRows.includes(el.ypos) && el.ypos <= 7) return true;

      // Inner Transition check category
      if (selectedInnerRows.includes('lanthanide') && el.category === '鑭系元素') return true;
      if (selectedInnerRows.includes('actinide') && el.category === '錒系元素') return true;

      return false;
    });

    if (pool.length === 0) {
      alert("請至少選擇一個範圍喔！");
      return;
    }

    // Generate Questions
    const generatedQuestions: LocalQuizQuestion[] = pool.map(el => {
      // Create distractors
      const otherElements = ELEMENTS.filter(e => e.number !== el.number);
      const shuffledOthers = otherElements.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      const optionsObjects = [el, ...shuffledOthers].sort(() => 0.5 - Math.random());
      const options = optionsObjects.map(e => e.name);
      
      const correctIndex = options.indexOf(el.name);
      const answerChar = ["A", "B", "C", "D"][correctIndex];

      return {
        題目: `${el.englishName} (${el.symbol})`,
        選項: options,
        答案: answerChar
      };
    });

    // Shuffle final questions list
    const finalQuestions = generatedQuestions.sort(() => 0.5 - Math.random()).slice(0, targetLength);

    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizState('playing');
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple answers
    setSelectedAnswer(index);

    const currentQ = questions[currentIndex];
    const correctLetter = currentQ.答案; // "A", "B", "C", "D"
    const answerMap: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
    const correctIndex = answerMap[correctLetter];

    if (index === correctIndex) {
      playCorrectSound();
      setIsCorrect(true);
      setScore(s => s + 100);
    } else {
      playIncorrectSound();
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    playSelectSound();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setQuizState('finished');
    }
  };

  const resetToMenu = () => {
    playSelectSound();
    setQuizState('menu');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // --- Render: Menu ---
  if (quizState === 'menu') {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Left: Standard Quiz */}
           <div className="bg-nook-cream p-8 rounded-nook border-4 border-white shadow-xl flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-nook-green rounded-full flex items-center justify-center mb-4 text-white text-3xl shadow-md transform -rotate-3">
                📝
              </div>
              <h2 className="text-2xl font-black text-nook-text mb-2">標準測驗</h2>
              <p className="text-nook-text opacity-70 mb-6 font-medium text-sm">
                包含原子序、符號、分類的綜合測驗。
              </p>
              
              <div className="w-full bg-white/50 p-4 rounded-3xl mb-6">
                <p className="text-nook-text font-bold mb-2 text-xs opacity-60 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Settings2 size={14} /> 主題
                </p>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {QUIZ_TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTopicSelect(t)}
                      className={`
                        px-4 py-2 rounded-full font-bold text-xs transition-all border-2
                        ${topic === t 
                          ? 'bg-nook-orange text-white border-nook-orange shadow-md' 
                          : 'bg-white text-nook-text border-nook-tan hover:bg-nook-bg'}
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <p className="text-nook-text font-bold mb-2 text-xs opacity-60 uppercase tracking-widest flex items-center justify-center gap-2">
                    <RefreshCw size={14} /> 題數
                </p>
                <div className="flex justify-center gap-2">
                  {QUIZ_LENGTHS.map((len) => (
                    <button 
                      key={len} 
                      onClick={() => handleLengthSelect(len)}
                      className={`
                        w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border-2 transition-all
                        ${targetLength === len 
                          ? 'bg-nook-blue text-white border-nook-blue shadow-md' 
                          : 'bg-white text-nook-text border-nook-tan hover:border-nook-blue/50'}
                      `}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={startStandardQuiz}
                className="w-full bg-nook-blue text-white font-bold text-lg py-3 rounded-full border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mt-auto"
              >
                <Play fill="currentColor" size={18} /> 開始測驗
              </button>
           </div>

           {/* Right: English-Chinese Quiz */}
           <div className="bg-[#FFFDF0] p-8 rounded-nook border-4 border-nook-tan shadow-xl flex flex-col items-center text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-nook-orange/30"></div>
               <div className="w-20 h-20 bg-nook-orange rounded-full flex items-center justify-center mb-4 text-white text-3xl shadow-md transform rotate-3">
                 <Languages size={32} />
               </div>
               <h2 className="text-2xl font-black text-nook-text mb-2">英翻中挑戰</h2>
               <p className="text-nook-text opacity-70 mb-6 font-medium text-sm">
                 選擇你想練習的元素範圍，挑戰你的英文記憶力！
               </p>

               <div className="w-full bg-nook-tan/20 p-4 rounded-3xl mb-6 flex-1 flex flex-col justify-center items-center border-2 border-dashed border-nook-tan">
                  <LayoutGrid className="text-nook-text opacity-30 mb-2" size={48} />
                  <p className="text-xs text-nook-text font-bold">自訂範圍：主族、過渡元素、內過渡元素</p>
               </div>

               <div className="w-full mb-6">
                  <p className="text-nook-text font-bold mb-2 text-xs opacity-60 uppercase tracking-widest flex items-center justify-center gap-2">
                      <RefreshCw size={14} /> 題數
                  </p>
                  <div className="flex justify-center gap-2">
                    {QUIZ_LENGTHS.map((len) => (
                      <button 
                        key={len} 
                        onClick={() => handleLengthSelect(len)}
                        className={`
                          w-10 h-10 rounded-full font-bold text-xs flex items-center justify-center border-2 transition-all
                          ${targetLength === len 
                            ? 'bg-nook-orange text-white border-nook-orange shadow-md' 
                            : 'bg-white text-nook-text border-nook-tan hover:border-nook-orange/50'}
                        `}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
               </div>

               <button 
                 onClick={openSelector}
                 className="w-full bg-nook-orange text-white font-bold text-lg py-3 rounded-full border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
               >
                 <CheckSquare size={18} /> 選擇範圍
               </button>
           </div>

        </div>
      </div>
    );
  }

  // --- Render: Selector (New View) ---
  if (quizState === 'selector') {
    const groupCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    const transitionRows = [4, 5, 6, 7];

    return (
      <div className="max-w-5xl mx-auto w-full px-4 pb-20 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-nook-cream p-4 sm:p-8 rounded-nook border-4 border-white shadow-xl">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-nook-text flex items-center gap-2">
                <CheckSquare className="text-nook-orange" /> 選擇測驗範圍
              </h2>
              <button onClick={resetToMenu} className="text-nook-text/50 font-bold hover:text-nook-text">取消</button>
           </div>

           <div className="bg-white/50 p-4 rounded-3xl overflow-x-auto">
             <div className="min-w-[800px] flex flex-col gap-4">
                
                {/* Visual Representation of Table Selector */}
                <div className="grid grid-cols-18 gap-1 auto-rows-min">
                   
                   {/* Header Row (Groups) */}
                   {groupCols.map(g => (
                      <div key={g} className="flex flex-col items-center gap-1" style={{ gridColumn: g }}>
                         {/* Only show checkboxes for main groups 1,2, 13-18 */}
                         {(g <= 2 || g >= 13) ? (
                           <button 
                             onClick={() => toggleGroup(g)}
                             className={`
                               w-8 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-xs transition-all
                               ${selectedGroups.includes(g) 
                                 ? 'bg-nook-blue text-white border-nook-blue shadow-md scale-110' 
                                 : 'bg-white text-gray-400 border-gray-300 hover:border-nook-blue'}
                             `}
                           >
                             {selectedGroups.includes(g) && <CheckCircle size={14} />}
                             {!selectedGroups.includes(g) && g}
                           </button>
                         ) : (
                           <div className="w-8 h-8"></div>
                         )}
                      </div>
                   ))}

                   {/* Mock Rows to show structure */}
                   {/* Row 1 */}
                   <div className={`col-start-1 h-8 rounded bg-gray-200/50 ${selectedGroups.includes(1) ? 'bg-nook-blue/30 ring-2 ring-nook-blue' : ''}`}></div>
                   <div className={`col-start-18 h-8 rounded bg-gray-200/50 ${selectedGroups.includes(18) ? 'bg-nook-blue/30 ring-2 ring-nook-blue' : ''}`}></div>

                   {/* Row 2 & 3 */}
                   {[2, 3].map(r => (
                     <React.Fragment key={r}>
                       <div className={`col-start-1 h-8 rounded bg-gray-200/50 ${selectedGroups.includes(1) ? 'bg-nook-blue/30 ring-2 ring-nook-blue' : ''}`}></div>
                       <div className={`col-start-2 h-8 rounded bg-gray-200/50 ${selectedGroups.includes(2) ? 'bg-nook-blue/30 ring-2 ring-nook-blue' : ''}`}></div>
                       <div className={`col-start-13 col-span-6 h-8 rounded bg-gray-200/50 flex`}>
                          {[13,14,15,16,17,18].map(g => (
                             <div key={g} className={`flex-1 h-full border-r border-white/50 last:border-0 ${selectedGroups.includes(g) ? 'bg-nook-blue/30 ring-inset ring-2 ring-nook-blue' : ''}`}></div>
                          ))}
                       </div>
                     </React.Fragment>
                   ))}

                   {/* Transition Rows 4, 5, 6, 7 */}
                   {transitionRows.map(r => (
                      <React.Fragment key={r}>
                        {/* Main Group 1 & 2 cells */}
                        <div className={`col-start-1 h-8 rounded bg-gray-200/50 ${selectedGroups.includes(1) ? 'bg-nook-blue/30 ring-2 ring-nook-blue' : ''}`}></div>
                        <div className={`col-start-2 h-8 rounded bg-gray-200/50 ${selectedGroups.includes(2) ? 'bg-nook-blue/30 ring-2 ring-nook-blue' : ''}`}></div>
                        
                        {/* Transition Block Selector Button */}
                        <div className="col-start-3 col-span-10 relative h-8">
                           <button 
                             onClick={() => toggleTransitionRow(r)}
                             className={`
                               absolute inset-0 w-full h-full rounded border-2 flex items-center justify-center font-bold text-xs transition-all z-10
                               ${selectedTransitionRows.includes(r)
                                 ? 'bg-nook-yellow text-nook-text border-nook-orange shadow-md'
                                 : 'bg-nook-yellow/20 text-nook-text/40 border-nook-yellow/40 hover:bg-nook-yellow/40'}
                             `}
                           >
                             {selectedTransitionRows.includes(r) ? <CheckCircle size={14} className="mr-1"/> : null}
                             週期 {r} 過渡元素
                           </button>
                        </div>

                        {/* Main Group 13-18 cells */}
                         <div className={`col-start-13 col-span-6 h-8 rounded bg-gray-200/50 flex`}>
                          {[13,14,15,16,17,18].map(g => (
                             <div key={g} className={`flex-1 h-full border-r border-white/50 last:border-0 ${selectedGroups.includes(g) ? 'bg-nook-blue/30 ring-inset ring-2 ring-nook-blue' : ''}`}></div>
                          ))}
                       </div>
                      </React.Fragment>
                   ))}

                   {/* Spacing */}
                   <div className="h-4 col-span-18"></div>

                   {/* Lanthanides / Actinides */}
                   <div className="col-start-3 col-span-15 relative h-8">
                      <button 
                         onClick={() => toggleInnerRow('lanthanide')}
                         className={`
                           absolute inset-0 w-full h-full rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all z-10
                           ${selectedInnerRows.includes('lanthanide')
                             ? 'bg-nook-green text-white border-green-600 shadow-md'
                             : 'bg-nook-green/20 text-nook-text/40 border-nook-green/40 hover:bg-nook-green/40'}
                         `}
                       >
                         {selectedInnerRows.includes('lanthanide') ? <CheckCircle size={14} className="mr-1"/> : null}
                         鑭系元素 (Lanthanides)
                       </button>
                   </div>
                   <div className="col-start-3 col-span-15 relative h-8 mt-1">
                      <button 
                         onClick={() => toggleInnerRow('actinide')}
                         className={`
                           absolute inset-0 w-full h-full rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all z-10
                           ${selectedInnerRows.includes('actinide')
                             ? 'bg-rose-400 text-white border-rose-600 shadow-md'
                             : 'bg-rose-100 text-nook-text/40 border-rose-200 hover:bg-rose-200'}
                         `}
                       >
                         {selectedInnerRows.includes('actinide') ? <CheckCircle size={14} className="mr-1"/> : null}
                         錒系元素 (Actinides)
                       </button>
                   </div>

                </div>

             </div>
           </div>

           <div className="flex justify-center mt-8">
              <button 
                onClick={startEnglishQuiz}
                className="bg-nook-blue text-white font-bold text-xl py-4 px-12 rounded-full border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Play fill="currentColor" size={24} /> 開始英翻中測驗
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- Render: Playing ---
  if (quizState === 'playing') {
    const currentQ = questions[currentIndex];
    
    // Guard clause if data is missing
    if (!currentQ) {
       return <div className="p-10 text-center">題目載入錯誤... <button onClick={resetToMenu}>返回</button></div>;
    }

    const correctLetter = currentQ.答案; // "A", "B", "C", "D"
    const answerMap: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
    const correctIndex = answerMap[correctLetter];

    return (
      <div className="max-w-2xl mx-auto w-full px-4 pb-20">
         {/* Top Bar: Progress & Score */}
         <div className="flex justify-between items-center mb-6">
            <div className="bg-white/80 px-4 py-2 rounded-full font-bold text-nook-text shadow-sm border-2 border-white">
               問題 {currentIndex + 1} / {questions.length}
            </div>
            <div className="bg-nook-yellow px-4 py-2 rounded-full font-bold text-nook-text shadow-sm border-2 border-white flex items-center gap-2">
               <Trophy size={16} /> {score}
            </div>
         </div>

         <div className="bg-nook-cream p-6 sm:p-8 rounded-nook border-4 border-white shadow-xl relative animate-in zoom-in-95 duration-300">
           {/* Topic Badge */}
           <div className="absolute top-4 right-6 bg-nook-tan/50 px-3 py-1 rounded-full text-xs font-bold text-nook-text opacity-60">
             {quizMode === 'english-chinese' ? "英翻中" : topic}
           </div>

           {/* Question Text */}
           <div className="mb-8 mt-4 text-center">
             <h3 className="text-3xl sm:text-4xl font-black text-nook-text leading-tight drop-shadow-sm">
               {currentQ.題目}
             </h3>
             {quizMode === 'english-chinese' && (
                 <p className="text-nook-text/50 font-bold mt-2">這個元素的中文名稱是？</p>
             )}
           </div>

           {/* Options */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {currentQ.選項.map((optionText, idx) => {
               // Determine style based on state
               let buttonStyle = "bg-white border-nook-tan hover:bg-nook-bg hover:border-nook-green/50";
               
               if (selectedAnswer !== null) {
                 // Reveal phase
                 if (idx === correctIndex) {
                   buttonStyle = "bg-green-100 border-green-500 ring-2 ring-green-400";
                 } else if (selectedAnswer === idx) {
                   buttonStyle = "bg-red-100 border-red-500 opacity-80";
                 } else {
                   buttonStyle = "bg-gray-50 opacity-40 border-gray-200";
                 }
               }

               return (
                 <button
                   key={idx}
                   onClick={() => handleAnswer(idx)}
                   disabled={selectedAnswer !== null}
                   className={`
                     w-full text-left p-4 rounded-2xl border-2 font-bold text-nook-text transition-all
                     flex items-center justify-between group min-h-[80px]
                     ${buttonStyle}
                   `}
                 >
                   <span className="text-xl mx-auto">{optionText}</span>
                   {selectedAnswer !== null && idx === correctIndex && <div className="absolute right-3 top-3"><CheckCircle className="text-green-500" fill="white" size={24} /></div>}
                   {selectedAnswer === idx && idx !== correctIndex && <div className="absolute right-3 top-3"><XCircle className="text-red-500" fill="white" size={24} /></div>}
                 </button>
               );
             })}
           </div>

           {/* Bottom Action Bar */}
           {selectedAnswer !== null && (
             <div className="mt-6 pt-6 border-t-2 border-dashed border-nook-tan flex justify-end animate-in fade-in slide-in-from-bottom-2">
                <button 
                  onClick={nextQuestion}
                  className="bg-nook-blue text-white font-bold py-3 px-8 rounded-full shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? "下一題" : "查看結果"} <ArrowRight size={20} />
                </button>
             </div>
           )}
         </div>
      </div>
    );
  }

  // --- Render: Finished ---
  if (quizState === 'finished') {
    const percentage = Math.round((score / (questions.length * 100)) * 100);
    let comment = "還要再加油喔！";
    if (percentage === 100) comment = "完美！太厲害了！";
    else if (percentage >= 80) comment = "很棒！你是元素大師！";
    else if (percentage >= 60) comment = "不錯喔！繼續保持！";

    return (
      <div className="max-w-xl mx-auto w-full px-4 pb-20 pt-10">
         <div className="bg-nook-cream p-10 rounded-nook border-4 border-white shadow-xl text-center relative overflow-hidden">
            
            <div className="mb-6">
              <div className="inline-block bg-nook-yellow p-4 rounded-full border-4 border-white shadow-md mb-4">
                 <Trophy size={48} className="text-white drop-shadow-md" />
              </div>
              <h2 className="text-4xl font-black text-nook-text mb-2">測驗結束！</h2>
              <p className="text-xl font-bold text-nook-green">{comment}</p>
            </div>

            <div className="bg-white/60 rounded-3xl p-6 mb-8 border-2 border-white">
               <p className="text-nook-text/60 font-bold uppercase tracking-widest text-sm mb-2">最終得分</p>
               <p className="text-6xl font-black text-nook-text mb-4">{score}</p>
               <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                 <div className="bg-nook-green h-full rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
               </div>
               <p className="mt-2 text-sm text-nook-text/60 font-bold">答對 {score/100} / {questions.length} 題</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={resetToMenu}
                className="bg-nook-blue text-white font-bold py-4 px-8 rounded-full shadow-[0_4px_0_rgb(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
              >
                <Home size={20} /> 回到主選單
              </button>
            </div>
         </div>
      </div>
    );
  }

  return null;
};
