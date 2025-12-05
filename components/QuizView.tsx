import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { generateQuizQuestion } from '../services/geminiService';
import { CheckCircle, XCircle, Trophy, RefreshCw, Settings2 } from 'lucide-react';
import { playCorrectSound, playIncorrectSound, playClickSound, playSelectSound } from '../utils/sound';

const QUIZ_TOPICS = [
  "隨機",
  "鹼金屬",
  "鹼土金屬",
  "過渡金屬",
  "稀有氣體",
  "非金屬",
  "原子序與符號"
];

export const QuizView: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState<string>("隨機");

  const fetchQuestion = async () => {
    playSelectSound();
    setLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentQuestion(null);
    
    // Pass topic if not random
    const searchTopic = topic === "隨機" ? undefined : topic;
    const q = await generateQuizQuestion(searchTopic);
    setCurrentQuestion(q);
    setLoading(false);
  };

  const handleTopicSelect = (t: string) => {
    playClickSound();
    setTopic(t);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(index);
    if (currentQuestion && index === currentQuestion.correctAnswerIndex) {
      playCorrectSound();
      setIsCorrect(true);
      setScore(s => s + 100);
    } else {
      playIncorrectSound();
      setIsCorrect(false);
    }
  };

  const resetToMenu = () => {
    playSelectSound();
    setCurrentQuestion(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 pb-20">
      
      {/* Score Card */}
      <div className="bg-nook-yellow/90 border-4 border-white rounded-full px-6 py-2 mb-8 flex justify-between items-center shadow-lg w-max mx-auto">
         <div className="flex items-center gap-2">
            <div className="bg-nook-orange p-1 rounded-full text-white">
               <Trophy size={16} />
            </div>
            <span className="font-black text-nook-text text-sm uppercase tracking-wider">貍數</span>
         </div>
         <span className="font-black text-nook-text text-xl ml-4">{score}</span>
      </div>

      {!currentQuestion && !loading && (
        <div className="text-center bg-nook-cream p-10 rounded-nook border-4 border-white shadow-xl">
          <div className="w-24 h-24 bg-nook-green rounded-full flex items-center justify-center mx-auto mb-6 text-white text-4xl shadow-md">
            📝
          </div>
          <h2 className="text-3xl font-black text-nook-text mb-4">突擊測驗！</h2>
          
          {/* Topic Selection */}
          <div className="mb-6 bg-white/50 p-4 rounded-3xl">
            <p className="text-nook-text font-bold mb-3 text-sm opacity-60 uppercase tracking-widest flex items-center justify-center gap-2">
                <Settings2 size={16} /> 選擇測驗主題
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {QUIZ_TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleTopicSelect(t)}
                  className={`
                    px-4 py-2 rounded-full font-bold text-sm transition-all border-2
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

          <p className="text-nook-text mb-8 opacity-80 font-medium">
            {topic === "隨機" ? "隨機挑戰你的元素知識！" : `專注於 ${topic} 的測驗！`}
            <br/>
            答對的話貍克會給你獎勵喔！
          </p>
          <button 
            onClick={fetchQuestion}
            className="bg-nook-blue text-white font-bold text-xl py-4 px-10 rounded-full border-b-4 border-blue-600 active:border-b-0 active:translate-y-1 transition-all"
          >
            開始測驗
          </button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center h-64">
           <div className="animate-spin text-4xl mb-4">🍃</div>
           <p className="text-nook-text font-bold text-lg animate-pulse">
             {topic === "隨機" ? "思考中..." : `正在尋找關於 ${topic} 的問題...`}
           </p>
        </div>
      )}

      {currentQuestion && (
        <div className="bg-nook-cream p-6 sm:p-8 rounded-nook border-4 border-white shadow-xl relative animate-in zoom-in-95 duration-300">
           {/* Display current topic badge */}
           <div className="absolute top-4 right-6 bg-nook-tan/50 px-3 py-1 rounded-full text-xs font-bold text-nook-text opacity-60">
             {topic}
           </div>

           {/* Question Bubble */}
           <div className="mb-8 mt-2">
             <h3 className="text-xl sm:text-2xl font-black text-nook-text leading-tight">
               {currentQuestion.question}
             </h3>
           </div>

           {/* Options */}
           <div className="space-y-3">
             {currentQuestion.options.map((option, idx) => {
               let buttonStyle = "bg-white border-nook-tan hover:bg-nook-bg";
               if (selectedAnswer !== null) {
                 if (idx === currentQuestion.correctAnswerIndex) {
                   buttonStyle = "bg-green-100 border-green-400 ring-2 ring-green-400";
                 } else if (selectedAnswer === idx) {
                   buttonStyle = "bg-red-100 border-red-400";
                 } else {
                   buttonStyle = "bg-gray-50 opacity-50";
                 }
               }

               return (
                 <button
                   key={idx}
                   onClick={() => handleAnswer(idx)}
                   disabled={selectedAnswer !== null}
                   className={`
                     w-full text-left p-4 rounded-2xl border-2 font-bold text-nook-text transition-all
                     flex items-center justify-between
                     ${buttonStyle}
                   `}
                 >
                   <span>{option}</span>
                   {selectedAnswer !== null && idx === currentQuestion.correctAnswerIndex && <CheckCircle className="text-green-500" />}
                   {selectedAnswer === idx && idx !== currentQuestion.correctAnswerIndex && <XCircle className="text-red-500" />}
                 </button>
               );
             })}
           </div>

           {/* Feedback Area */}
           {selectedAnswer !== null && (
             <div className="mt-6 p-4 bg-nook-bg rounded-2xl border-2 border-nook-green/30 animate-in slide-in-from-bottom-2">
               <div className="flex items-start gap-3">
                 <div className="bg-white p-2 rounded-full shrink-0">
                    {isCorrect ? '🦝' : '🦉'}
                 </div>
                 <div>
                   <p className="font-bold text-nook-text text-lg mb-1">
                     {isCorrect ? "答對了！是的，是的！" : "噢不... 呼..."}
                   </p>
                   <p className="text-nook-text text-sm opacity-90">
                     {currentQuestion.explanation}
                   </p>
                 </div>
               </div>
               
               <div className="flex gap-3 mt-6">
                 <button 
                    onClick={resetToMenu}
                    className="flex-1 bg-white border-2 border-nook-tan text-nook-text font-bold py-3 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-800 transition-colors"
                 >
                   更換主題
                 </button>
                 <button 
                   onClick={fetchQuestion}
                   className="flex-[2] bg-nook-orange text-white font-bold py-3 rounded-xl hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 border-b-4 border-orange-600 active:border-b-0 active:translate-y-1"
                 >
                   <RefreshCw size={18} /> 下一題
                 </button>
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
