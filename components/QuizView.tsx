
import React, { useState, useEffect } from 'react';
import { LocalQuizQuestion } from '../types';
import { CheckCircle, XCircle, Trophy, RefreshCw, Settings2, Play, ArrowRight, Home } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound, playSelectSound } from '../utils/sound';
import { QUIZ_RANDOM } from '../data/quiz_random';
import { QUIZ_SYMBOLS } from '../data/quiz_symbols';

const QUIZ_TOPICS = ["隨機", "原子序與符號"];
const QUIZ_LENGTHS = [10, 30, 100];

type QuizState = 'menu' | 'playing' | 'finished';

export const QuizView: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('menu');
  const [topic, setTopic] = useState<string>("隨機");
  const [targetLength, setTargetLength] = useState<number>(10);
  
  const [questions, setQuestions] = useState<LocalQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleTopicSelect = (t: string) => {
    playClickSound();
    setTopic(t);
  };

  const handleLengthSelect = (len: number) => {
    playClickSound();
    setTargetLength(len);
  };

  const startQuiz = () => {
    playSelectSound();
    
    // Select Source Data
    let sourceData = topic === "隨機" ? QUIZ_RANDOM : QUIZ_SYMBOLS;
    
    // Shuffle Data
    const shuffled = [...sourceData].sort(() => 0.5 - Math.random());
    
    // Slice to target length (or max available)
    const selectedQuestions = shuffled.slice(0, targetLength);
    
    // If not enough questions, we just use what we have (in a real app, maybe repeat or warn)
    // For this demo, duplicate if necessary to reach target length for testing visual flow? 
    // No, let's just use what we have to avoid duplicate questions in a single run.
    
    setQuestions(selectedQuestions);
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
      <div className="max-w-2xl mx-auto w-full px-4 pb-20">
        <div className="text-center bg-nook-cream p-6 sm:p-10 rounded-nook border-4 border-white shadow-xl">
          <div className="w-24 h-24 bg-nook-green rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-md">
            📝
          </div>
          <h2 className="text-3xl font-black text-nook-text mb-2">突擊測驗！</h2>
          <p className="text-nook-text opacity-70 mb-8 font-medium">準備好挑戰了嗎？選擇你的題目與數量！</p>
          
          {/* Settings Container */}
          <div className="bg-white/50 p-6 rounded-3xl mb-8">
            
            {/* Topic Selection */}
            <div className="mb-6">
              <p className="text-nook-text font-bold mb-3 text-sm opacity-60 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Settings2 size={16} /> 選擇測驗主題
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {QUIZ_TOPICS.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTopicSelect(t)}
                    className={`
                      px-6 py-3 rounded-full font-bold text-sm transition-all border-2
                      ${topic === t 
                        ? 'bg-nook-orange text-white border-nook-orange shadow-md transform scale-105' 
                        : 'bg-white text-nook-text border-nook-tan hover:bg-nook-bg hover:border-nook-orange/50'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div>
              <p className="text-nook-text font-bold mb-3 text-sm opacity-60 uppercase tracking-widest flex items-center justify-center gap-2">
                  <RefreshCw size={16} /> 選擇題數
              </p>
              <div className="flex justify-center gap-4">
                {QUIZ_LENGTHS.map((len) => (
                  <label 
                    key={len} 
                    className={`
                      cursor-pointer flex items-center gap-2 px-4 py-2 rounded-2xl border-2 transition-all
                      ${targetLength === len 
                        ? 'bg-nook-blue/10 border-nook-blue text-nook-text font-bold' 
                        : 'bg-white border-nook-tan text-nook-text/60 hover:border-nook-blue/50'}
                    `}
                    onClick={() => handleLengthSelect(len)}
                  >
                    <input 
                      type="radio" 
                      name="quizLength" 
                      value={len} 
                      checked={targetLength === len} 
                      onChange={() => handleLengthSelect(len)}
                      className="hidden" // Custom styling via parent
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${targetLength === len ? 'border-nook-blue' : 'border-gray-300'}`}>
                      {targetLength === len && <div className="w-2 h-2 bg-nook-blue rounded-full"></div>}
                    </div>
                    <span>{len} 題</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          <button 
            onClick={startQuiz}
            className="w-full sm:w-auto bg-nook-blue text-white font-bold text-xl py-4 px-12 rounded-full border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto"
          >
            <Play fill="currentColor" size={20} /> 開始測驗
          </button>
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
             {topic}
           </div>

           {/* Question Text */}
           <div className="mb-8 mt-2">
             <h3 className="text-xl sm:text-2xl font-black text-nook-text leading-tight">
               {currentQ.題目}
             </h3>
           </div>

           {/* Options */}
           <div className="space-y-3">
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
                     flex items-center justify-between group
                     ${buttonStyle}
                   `}
                 >
                   <span className="text-lg">{optionText}</span>
                   {selectedAnswer !== null && idx === correctIndex && <CheckCircle className="text-green-500" fill="white" size={24} />}
                   {selectedAnswer === idx && idx !== correctIndex && <XCircle className="text-red-500" fill="white" size={24} />}
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
            {/* Confetti / Background decoration could go here */}
            
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
