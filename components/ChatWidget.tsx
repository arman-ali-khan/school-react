import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User, Bot, RefreshCw } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! Welcome to Dinajpur Education Board. How can I assist you today?', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getGeminiResponse(userMsg.text);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-50 transition-all transform hover:scale-105 ${isOpen ? 'scale-0 opacity-0' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform origin-bottom-right border border-gray-200 dark:border-gray-700 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="bg-emerald-700 dark:bg-emerald-900 text-white p-4 rounded-t-xl flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} />
            </div>
            <div>
                <h3 className="font-bold text-sm">Board Assistant</h3>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Online
                </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-600 dark:hover:bg-emerald-800 p-1 rounded transition">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900/50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-lg text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-bl-none'
                }`}
              >
                {msg.text}
                <div className={`text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-emerald-100' : 'text-gray-400 dark:text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg rounded-bl-none border border-gray-200 dark:border-gray-600 shadow-sm flex items-center gap-2">
                 <RefreshCw size={14} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                 <span className="text-xs text-gray-500 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-xl flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about results, registration..."
            className="flex-1 text-sm px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;