
import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import RobotAvatar from './RobotAvatar';
import { transformParentMessage } from '../services/geminiService';

const FloatingAssistant: React.FC<{ skinId: string }> = ({ skinId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [lastTransformed, setLastTransformed] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    setIsSending(true);
    const transformed = await transformParentMessage(message);
    setLastTransformed(transformed);
    setIsSending(false);
    
    // Simulate sending to robot
    setTimeout(() => {
      setMessage('');
      setLastTransformed(null);
      setIsOpen(false);
      alert(`指令已优化并同步至机器人：\n"${transformed}"`);
    }, 2000);
  };

  return (
    <div className="fixed bottom-28 right-4 z-[60]">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 p-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold flex items-center gap-2 text-blue-600">
              <Sparkles size={18} /> 传话小助手
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-xs text-gray-500">在此输入想对孩子说的话，我会以有趣的口吻传达给 TA 喔！</p>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="例如：别玩电脑了，去休息会儿"
                className="w-full h-24 p-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
              />
              <button 
                disabled={isSending || !message.trim()}
                onClick={handleSend}
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-xl disabled:opacity-50"
              >
                {isSending ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Send size={18} />}
              </button>
            </div>

            {lastTransformed && (
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 animate-pulse">
                <p className="text-[10px] text-blue-400 font-bold mb-1">AI 正在优化语气...</p>
                <p className="text-sm text-blue-700 italic">"{lastTransformed}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 bg-white rounded-2xl shadow-xl border border-blue-100 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="scale-50">
           <RobotAvatar skinId={skinId} expression={isOpen ? 'happy' : 'winking'} size="sm" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          点击传话
        </div>
      </button>
    </div>
  );
};

export default FloatingAssistant;
