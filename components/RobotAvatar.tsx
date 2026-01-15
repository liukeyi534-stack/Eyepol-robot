
import React from 'react';

interface RobotAvatarProps {
  skinId: string;
  expression: 'happy' | 'winking' | 'sleeping' | 'alert';
  accessoryId?: string;
  backgroundId?: string;
  size?: 'sm' | 'md' | 'lg';
}

const RobotAvatar: React.FC<RobotAvatarProps> = ({ 
  skinId, 
  expression, 
  accessoryId = 'none', 
  backgroundId = 'default', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  const getSkinStyles = () => {
    switch(skinId) {
      case 'space': return 'from-blue-600 via-indigo-700 to-slate-900 text-white';
      case 'forest': return 'from-emerald-500 via-teal-600 to-green-900 text-white';
      case 'sunset': return 'from-pink-400 via-orange-400 to-red-500 text-white';
      default: return 'from-white via-slate-50 to-blue-50 text-blue-600';
    }
  };

  const getBgColor = () => {
    switch(backgroundId) {
      case 'nebula': return 'bg-indigo-950/20 shadow-[inset_0_0_40px_rgba(99,102,241,0.2)]';
      case 'grass': return 'bg-green-100/40 shadow-[inset_0_0_40px_rgba(34,197,94,0.1)]';
      case 'sunny': return 'bg-yellow-50 shadow-[inset_0_0_40px_rgba(234,179,8,0.1)]';
      default: return 'bg-white shadow-[inset_0_0_40px_rgba(0,0,0,0.02)]';
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto p-4 rounded-[3rem] transition-all duration-700 ease-in-out border border-white/40 ${getBgColor()}`}>
      {/* Star Shape Body with deeper texture */}
      <div className={`absolute inset-6 bg-gradient-to-br ${getSkinStyles()} rounded-[28%] rotate-45 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[5px] border-yellow-400/90 z-10 transition-all duration-500`}>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
      </div>
      
      {/* Face Screen - OLED Style */}
      <div className="absolute inset-x-0 bottom-12 h-[35%] mx-auto w-[65%] bg-[#050510] rounded-full z-20 flex items-center justify-center border-[3px] border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
        <div className="flex gap-4 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
          {expression === 'winking' && (
            <><div className="w-3.5 h-3.5 rounded-full bg-blue-400 animate-pulse"></div><div className="w-3.5 h-1.5 bg-blue-400 rounded-full mt-2 rotate-12"></div></>
          )}
          {expression === 'happy' && (
            <><div className="w-3.5 h-3.5 rounded-full bg-blue-400 animate-bounce"></div><div className="w-3.5 h-3.5 rounded-full bg-blue-400 animate-bounce delay-150"></div></>
          )}
          {expression === 'sleeping' && <div className="text-sm font-black italic tracking-widest animate-pulse">Zzz</div>}
          {expression === 'alert' && (
            <><div className="w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></div><div className="w-3.5 h-3.5 bg-red-500 rounded-full animate-ping delay-75"></div></>
          )}
        </div>
      </div>

      {/* Advanced Accessory Rendering with floating animation */}
      {accessoryId !== 'none' && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 text-5xl animate-[float_3s_ease-in-out_infinite] drop-shadow-xl">
          {accessoryId === 'crown' && '👑'}
          {accessoryId === 'glasses' && '🕶️'}
          {accessoryId === 'ribbon' && '🎀'}
        </div>
      )}

      {/* Center Star Emblem with glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 text-blue-500/80 filter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
        <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, 0px); }
          50% { transform: translate(-50%, -10px); }
        }
      `}</style>
    </div>
  );
};

export default RobotAvatar;
