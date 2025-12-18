
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, RefreshCw, User } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'স্বাগতম! দিনাজপুর শিক্ষা বোর্ড পোর্টালে আপনাকে স্বাগতম। আমি কিভাবে আপনাকে সাহায্য করতে পারি?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botResponse = await getGeminiResponse(userMsg.text);
    setMessages(prev => [...prev, { role: 'model', text: botResponse, timestamp: new Date() }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-emerald-600 text-white rounded-full shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-110 transition-all active:scale-95 flex items-center gap-2 group"
        >
          <MessageSquare size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-sm font-bold">Ask Assistant</span>
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] md:w-[400px] h-[550px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden animate-slide-up">
          <div className="p-4 bg-emerald-700 dark:bg-emerald-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Portal AI Assistant</h3>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Live Support
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-xl transition">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-950/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm transition-all ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none font-medium' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border dark:border-gray-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-bl-none border dark:border-gray-700 shadow-sm flex items-center gap-2">
                  <RefreshCw className="animate-spin text-emerald-500" size={14} />
                  <span className="text-xs text-gray-400">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 dark:text-white"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
