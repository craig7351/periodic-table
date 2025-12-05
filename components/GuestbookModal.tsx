
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users, Filter, Tag } from 'lucide-react';
import { GuestMessage, GuestbookTag } from '../types';
import { addMessage, subscribeToMessages } from '../services/guestbookService';
import { playClickSound, playSelectSound } from '../utils/sound';

interface Props {
  onClose: () => void;
  visitorCount: number;
}

const TAG_COLORS: Record<GuestbookTag, string> = {
  "一般留言": "bg-nook-green text-white",
  "問題回報": "bg-red-400 text-white",
  "許願功能": "bg-nook-blue text-white"
};

const TAG_OPTIONS: GuestbookTag[] = ["一般留言", "問題回報", "許願功能"];

export const GuestbookModal: React.FC<Props> = ({ onClose, visitorCount }) => {
  const [messages, setMessages] = useState<GuestMessage[]>([]);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState<GuestbookTag>("一般留言");
  const [filterTag, setFilterTag] = useState<GuestbookTag | "All">("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newContent.trim()) return;

    playSelectSound();
    setIsSubmitting(true);
    try {
      await addMessage(newName, newContent, newTag);
      setNewContent(""); // Keep name and tag, clear content
    } catch (error) {
      alert("傳送失敗，請確認 Firebase 設定是否正確。");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date loosely like AC
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const filteredMessages = filterTag === "All" 
    ? messages 
    : messages.filter(msg => (msg.tag || "一般留言") === filterTag);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Bulletin Board Style Container */}
      <div className="relative w-full max-w-md bg-[#F4D264] border-8 border-[#7C5C38] rounded-3xl shadow-2xl flex flex-col h-[85vh] max-h-[800px] overflow-hidden">
        
        {/* Header - Wooden Plank Style */}
        <div className="bg-[#7C5C38] p-4 flex justify-between items-center relative z-10 border-b-4 border-[#5E4228] shrink-0">
           <div className="flex items-center gap-3">
             <div className="bg-[#F2E6C6] p-2 rounded-full border-2 border-[#5E4228]">
                <Users size={20} className="text-[#7C5C38]" />
             </div>
             <div>
                <h2 className="text-xl font-black text-[#F2E6C6] tracking-widest">島民佈告欄</h2>
                <p className="text-[#F2E6C6] text-xs font-bold opacity-80">累積訪客: {visitorCount}</p>
             </div>
           </div>
           
           <button 
             onClick={() => { playClickSound(); onClose(); }}
             className="p-2 bg-[#F2E6C6] rounded-full hover:bg-red-100 text-[#7C5C38] transition-colors shadow-sm border-2 border-[#5E4228]"
           >
             <X size={20} />
           </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-[#E6D7B5] p-2 px-4 flex gap-2 overflow-x-auto shrink-0 border-b-2 border-[#C7B288] scrollbar-hide">
           <button
             onClick={() => { playClickSound(); setFilterTag("All"); }}
             className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 
               ${filterTag === "All" 
                 ? "bg-[#7C5C38] text-[#F2E6C6] border-[#5E4228]" 
                 : "bg-[#FFFDF0] text-[#7C5C38] border-[#7C5C38] hover:bg-white"}`}
           >
             全部顯示
           </button>
           {TAG_OPTIONS.map(tag => (
             <button
               key={tag}
               onClick={() => { playClickSound(); setFilterTag(tag); }}
               className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2 
                 ${filterTag === tag 
                   ? "bg-[#7C5C38] text-[#F2E6C6] border-[#5E4228]" 
                   : "bg-[#FFFDF0] text-[#7C5C38] border-[#7C5C38] hover:bg-white"}`}
             >
               {tag}
             </button>
           ))}
        </div>

        {/* Messages List - Paper Style */}
        <div className="flex-1 overflow-y-auto p-4 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-[#FFFDF0]">
          {filteredMessages.length === 0 ? (
             <div className="text-center py-10 opacity-50 font-bold text-[#7C5C38]">
                {filterTag === "All" ? "目前還沒有留言...<br/>快來搶頭香！" : "這個分類還沒有留言喔！"}
             </div>
          ) : (
             <div className="space-y-4">
               {filteredMessages.map((msg) => (
                 <div key={msg.id} className="bg-white p-3 rounded-xl shadow-sm border border-[#E6D7B5] transform hover:rotate-1 transition-transform relative group">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-2">
                          <span className="text-2xl filter drop-shadow-sm">{msg.avatar || "🙂"}</span>
                          <span className="font-black text-[#5B4D3C]">{msg.name}</span>
                       </div>
                       <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${TAG_COLORS[msg.tag || "一般留言"]}`}>
                         {msg.tag || "一般留言"}
                       </span>
                    </div>
                    <p className="text-[#5B4D3C] text-sm leading-relaxed whitespace-pre-wrap pl-9 break-words">
                      {msg.content}
                    </p>
                    <div className="text-right mt-1">
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        {formatDate(msg.timestamp)}
                      </span>
                    </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
             </div>
          )}
        </div>

        {/* Input Area - Corkboard Style */}
        <div className="bg-[#B99A69] p-4 border-t-4 border-[#94764D] shrink-0">
           <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="你的名字"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    maxLength={10}
                    className="w-1/3 px-3 py-2 rounded-xl border-2 border-[#94764D] bg-[#FFFDF0] text-[#5B4D3C] font-bold placeholder-[#5B4D3C]/40 focus:outline-none focus:ring-2 focus:ring-[#7C5C38] text-sm"
                    required
                  />
                  {/* Tag Selector */}
                  <div className="flex-1 flex bg-[#FFFDF0] rounded-xl border-2 border-[#94764D] p-1 gap-1 overflow-x-auto">
                    {TAG_OPTIONS.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => { playClickSound(); setNewTag(tag); }}
                        className={`flex-1 rounded-lg text-[10px] font-bold py-1 whitespace-nowrap transition-all ${
                          newTag === tag ? TAG_COLORS[tag] + " shadow-sm" : "text-[#5B4D3C] hover:bg-[#E6D7B5]"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="寫點什麼..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  maxLength={50}
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-[#94764D] bg-[#FFFDF0] text-[#5B4D3C] font-medium placeholder-[#5B4D3C]/40 focus:outline-none focus:ring-2 focus:ring-[#7C5C38]"
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#4DB5E6] hover:bg-[#3CA0D0] text-white p-3 rounded-xl border-b-4 border-[#2B80A8] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
           </form>
        </div>

      </div>
    </div>
  );
};
