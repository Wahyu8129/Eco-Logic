import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function EcoBotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { dailyMissions, weeklyMissions } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Halo! Saya EcoBot 🌱\nAda yang bisa saya bantu?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll ke bawah setiap ada pesan baru
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Jangan tampilkan widget di halaman login/register
  if (['/login', '/register'].includes(location.pathname)) {
    return null;
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    let missionContextStr = '';
    if (dailyMissions && dailyMissions.length > 0) {
      missionContextStr += 'Misi Harian:\n' + dailyMissions.map(m => `- ${m.name} (${m.progress}/${m.target})`).join('\n') + '\n';
    }
    if (weeklyMissions && weeklyMissions.length > 0) {
      missionContextStr += 'Misi Mingguan:\n' + weeklyMissions.map(m => `- ${m.name} (${m.progress}/${m.target})`).join('\n') + '\n';
    }

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, missionContext: missionContextStr })
      });

      const data = await response.json();
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: data.success ? data.reply : 'Maaf, terjadi kesalahan di server.'
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Maaf, saya tidak dapat terhubung ke server saat ini. Pastikan koneksi internet Anda lancar.'
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[60] p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 animate-bounce-slow'}`}
        aria-label="Tanya EcoBot"
      >
        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Jendela Chat Popup */}
      <div className={`fixed bottom-20 right-4 md:bottom-24 md:right-6 z-[70] w-[90vw] max-w-[400px] h-[65vh] max-h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-50 opacity-0 pointer-events-none'}`}>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-emerald-500 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">EcoBot</h2>
              <p className="text-[10px] text-emerald-100">Selalu Aktif (Online)</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1.5 rounded-full hover:bg-emerald-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50 text-sm">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
              }`}>
                {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div className={`max-w-[80%] px-3 py-2 rounded-2xl whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-emerald-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-sm rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Bot size={14} />
              </div>
              <div className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none shadow-sm text-slate-500 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-emerald-500" />
                <span className="text-xs">Mengetik...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tanya sesuatu..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white dark:placeholder-slate-400 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors shrink-0"
            >
              <Send size={18} className={inputValue.trim() && !isLoading ? 'ml-0.5' : ''} />
            </button>
          </form>
        </div>
        
      </div>
    </>
  );
}
