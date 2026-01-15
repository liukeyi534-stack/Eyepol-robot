
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Gift, 
  MessageSquareHeart,
  LayoutDashboard,
  Trophy,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Bell,
  Battery,
  Smartphone,
  Zap,
  Star,
  ShoppingBag,
  Sparkles,
  X,
  Send,
  PowerOff,
  Plus,
  Target,
  FileText
} from 'lucide-react';
import { 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Tab, EyeStatus, RobotConfig, RewardTask, Achievement, TaskStatus } from './types';
import { COLORS, DAILY_MOCK, WEEKLY_MOCK, SKINS, ACCESSORIES, BACKGROUNDS, ACHIEVEMENTS } from './constants';
import RobotAvatar from './components/RobotAvatar';
import FloatingAssistant from './components/FloatingAssistant';
import { getHealthInsight, generateEncouragement, transformParentMessage } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [showStore, setShowStore] = useState(false);
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');
  const [showEncourageModal, setShowEncourageModal] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [encourageMsg, setEncourageMsg] = useState('');
  const [isTransforming, setIsTransforming] = useState(false);
  
  const [newTask, setNewTask] = useState({ name: '', desc: '', target: '', reward: '' });

  const [robotStatus, setRobotStatus] = useState<RobotConfig>({
    id: 'Starry-QX88',
    battery: 92,
    sensitivity: 80,
    volume: 60,
    currentSkin: 'classic',
    currentAccessory: 'none',
    currentBackground: 'default',
    online: true
  });
  
  const [eyeStatus, setEyeStatus] = useState<EyeStatus>({
    distance: 36,
    posture: 'good',
    duration: 45,
    lastRest: '15:10'
  });

  const [notifications, setNotifications] = useState({
    distance: true,
    posture: true,
    break: true,
    achievement: true
  });

  const [aiInsight, setAiInsight] = useState<string>("正在智能分析今日用眼趋势...");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const lastFetchTimeRef = useRef<number>(0);

  const [tasks, setTasks] = useState<RewardTask[]>([
    { id: '1', title: '完成一次眼保健操', points: 10, status: 'in-progress' },
    { id: '2', title: '两小时保持正确坐姿', points: 20, status: 'completed' },
    { id: '3', title: '户外运动一小时', points: 30, status: 'unfinished' },
    { id: '4', title: '全天用眼距离达标', points: 50, status: 'completed' },
  ]);

  const fetchInsight = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 15 * 60 * 1000) return;
    setLoadingInsight(true);
    const insight = await getHealthInsight({ eyeStatus, historical: WEEKLY_MOCK });
    setAiInsight(insight);
    setLoadingInsight(false);
    lastFetchTimeRef.current = now;
  }, [eyeStatus]);

  useEffect(() => {
    fetchInsight();
    const interval = setInterval(() => {
      setEyeStatus(prev => ({
        ...prev,
        distance: Math.floor(Math.random() * (45 - 25) + 25),
        duration: prev.duration + 1
      }));
    }, 45000);
    return () => clearInterval(interval);
  }, [fetchInsight]);

  const handleEncourageSend = async () => {
    if (!encourageMsg.trim()) return;
    setIsTransforming(true);
    const result = await transformParentMessage(encourageMsg);
    alert(`指令已优化发送：\n"${result}"`);
    setIsTransforming(false);
    setShowEncourageModal(false);
    setEncourageMsg('');
  };

  const handleAddTask = () => {
    if (!newTask.name) return;
    const task: RewardTask = {
      id: Date.now().toString(),
      title: newTask.name,
      points: parseInt(newTask.reward) || 10,
      status: 'unfinished'
    };
    setTasks([task, ...tasks]);
    setShowAddTaskModal(false);
    setNewTask({ name: '', desc: '', target: '', reward: '' });
  };

  const currentChartData = reportType === 'daily' ? DAILY_MOCK : WEEKLY_MOCK;

  const renderHome = () => (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-8">
      {/* Device Status Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-white/50 relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
             <span className="text-sm font-black text-slate-400">设备实时状态</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
             <Battery size={16} className="text-blue-500" />
             <span className="text-sm font-black text-blue-900">{robotStatus.battery}%</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="relative">
             <div className="absolute inset-0 bg-blue-400/5 blur-[80px] rounded-full"></div>
             <RobotAvatar 
                skinId={robotStatus.currentSkin} 
                accessoryId={robotStatus.currentAccessory}
                backgroundId={robotStatus.currentBackground}
                expression={eyeStatus.distance < 30 ? 'alert' : 'happy'} 
                size="lg"
              />
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {eyeStatus.distance < 30 ? '距离太近，正在提醒' : '守护中：坐姿优异'}
            </h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">距离 {eyeStatus.distance}cm • 连续用眼 {eyeStatus.duration}min</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={() => setShowRestModal(true)} className="flex-1 bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
            <PowerOff size={20} className="text-red-400" /> 强制休息
          </button>
          <button onClick={() => setShowEncourageModal(true)} className="flex-1 bg-yellow-400 text-yellow-950 font-black py-5 rounded-2xl shadow-xl hover:bg-yellow-500 transition-all flex items-center justify-center gap-2">
            <MessageSquareHeart size={20} /> 夸夸孩子
          </button>
        </div>
      </div>

      {/* 1. 今日表现 Performance (Mid-Position) */}
      <div className="grid grid-cols-3 gap-3 px-1">
        {[
          { label: '姿势正确', val: '24次', color: 'text-blue-600', bg: 'bg-blue-50/50' },
          { label: '主动休息', val: '6次', color: 'text-yellow-600', bg: 'bg-yellow-50/50' },
          { label: '健康评分', val: '92分', color: 'text-slate-900', bg: 'bg-white shadow-sm border border-slate-100' }
        ].map((item, i) => (
          <div key={i} className={`${item.bg} p-5 rounded-[2rem] text-center border border-white/40 shadow-sm`}>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{item.label}</p>
            <p className={`text-xl font-black ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>

      {/* AI Insight Section */}
      <div className="px-1">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
             <Sparkles size={20} className="text-yellow-400" />
             <h3 className="text-lg font-black italic tracking-tight">AI 守护小结</h3>
          </div>
          <p className={`text-sm leading-relaxed font-medium z-10 relative italic ${loadingInsight ? 'animate-pulse' : ''}`}>
            "{aiInsight}"
          </p>
          <Activity size={120} className="absolute -bottom-8 -right-8 opacity-10 rotate-12" />
        </div>
      </div>

      {/* Action Modals */}
      {showEncourageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6 px-1">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 italic"><MessageSquareHeart className="text-yellow-400" /> 夸夸孩子</h3>
                 <button onClick={() => setShowEncourageModal(false)} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
              </div>
              <textarea 
                value={encourageMsg}
                onChange={(e) => setEncourageMsg(e.target.value)}
                placeholder="在此输入您想对孩子说的鼓励话语..."
                className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm mb-6 resize-none font-medium shadow-inner"
              />
              <button 
                disabled={isTransforming || !encourageMsg.trim()}
                onClick={handleEncourageSend}
                className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-100"
              >
                {isTransforming ? <Activity className="animate-spin" size={18} /> : <><Send size={18} /> 智能传达指令</>}
              </button>
           </div>
        </div>
      )}

      {showRestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                 <PowerOff size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 italic">强制进入休息?</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">设备将锁定屏幕并播放休息指引语音。</p>
              <div className="flex gap-4">
                 <button onClick={() => setShowRestModal(false)} className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-black">取消</button>
                 <button onClick={() => { alert('已下达休息指令'); setShowRestModal(false); }} className="flex-1 py-4 rounded-2xl bg-slate-900 text-white font-black shadow-xl">确认锁定</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );

  const renderData = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10">
      {/* Report Toggle */}
      <div className="p-1.5 bg-slate-200/40 rounded-full flex mx-1">
        <button 
          onClick={() => setReportType('daily')}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-black uppercase transition-all ${reportType === 'daily' ? 'bg-white shadow-md text-slate-900 scale-105' : 'text-slate-400'}`}
        >日报报告</button>
        <button 
          onClick={() => setReportType('weekly')}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-black uppercase transition-all ${reportType === 'weekly' ? 'bg-white shadow-md text-slate-900 scale-105' : 'text-slate-400'}`}
        >周报报告</button>
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 space-y-12">
        {/* Health Score Chart */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-900 italic">
               {reportType === 'daily' ? '今日' : '本周'}健康评分变化
            </h2>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">智能实时监测</div>
          </div>
          <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={currentChartData}>
                 <defs>
                   <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                     <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                 <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold'}} />
                 <Area type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={5} fill="url(#gradScore)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </section>

        {/* Eye Distance Trend */}
        <section>
          <h2 className="text-lg font-black text-slate-900 mb-8 italic">{reportType === 'daily' ? '今日' : '本周'}用眼距离趋势</h2>
          <div className="h-44 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={currentChartData}>
                 <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                 <Bar dataKey="avgDistance" radius={[8, 8, 0, 0]}>
                   {currentChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3B82F6' : '#FBBF24'} fillOpacity={0.8} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          </div>
        </section>

        {/* Study Duration Distribution */}
        <section>
          <h2 className="text-lg font-black text-slate-900 mb-8 italic">{reportType === 'daily' ? '今日' : '本周'}学习时长分布</h2>
          <div className="h-44 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={currentChartData}>
                 <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                 <Area type="stepBefore" dataKey="studyTime" stroke="#0F172A" strokeWidth={3} fill="#0F172A" fillOpacity={0.08} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* 2. 本周核心总结指标 ProgressBar Layout (Differentiated by reportType) */}
      <div className="space-y-4 px-1">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
           <Zap className="text-yellow-400" size={20} /> {reportType === 'daily' ? '今日' : '本周'}核心核心总结
        </h3>
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
          {[
            { label: '平均用眼距离', val: reportType === 'daily' ? 36.5 : 34.2, max: 45, unit: 'cm', color: 'bg-blue-500' },
            { label: '累计学习时长', val: reportType === 'daily' ? 180 : 735, max: reportType === 'daily' ? 300 : 1500, unit: 'min', color: 'bg-yellow-400' },
            { label: '姿势端正比例', val: reportType === 'daily' ? 95 : 92, max: 100, unit: '%', color: 'bg-blue-600' },
            { label: '有效休息次数', val: reportType === 'daily' ? 7 : 45, max: reportType === 'daily' ? 10 : 60, unit: '次', color: 'bg-slate-900' }
          ].map((ind, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ind.label}</span>
                <span className="text-base font-black text-slate-900">{ind.val}<span className="text-[10px] text-slate-300 ml-0.5">{ind.unit}</span></span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full ${ind.color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                  style={{ width: `${Math.min((ind.val / ind.max) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTasks = () => {
    if (showStore) return (
      <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-10">
        <div className="flex items-center gap-4 px-2">
          <button onClick={() => setShowStore(false)} className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-500">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-black text-slate-900 italic uppercase">Prize Store</h2>
        </div>
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <p className="text-xs font-bold opacity-40 mb-1">您的当前成长积分</p>
           <p className="text-5xl font-black italic text-yellow-400">1,250</p>
           <ShoppingBag size={100} className="absolute -right-4 -bottom-4 opacity-10" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { n: '星空皮肤', p: 1000, i: '✨' },
            { n: '皇冠配饰', p: 1500, i: '👑' },
            { n: '护眼台灯', p: 5000, i: '💡' },
            { n: '成长习惯本', p: 2000, i: '📔' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-50 text-center shadow-sm">
               <div className="text-4xl mb-4">{item.i}</div>
               <p className="font-black text-slate-900 mb-4">{item.n}</p>
               <button className="w-full bg-blue-50 text-blue-600 font-black py-3 rounded-xl flex items-center justify-center gap-1 text-[10px] uppercase">
                  <Gift size={12} /> {item.p} 兑换
               </button>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10">
        {/* Points Header */}
        <div className="bg-yellow-400 rounded-[2.5rem] p-8 text-yellow-950 shadow-xl shadow-yellow-100 flex justify-between items-center relative overflow-hidden group">
          <div className="z-10">
            <p className="text-xs font-black opacity-60 mb-1">今日累计成长积分</p>
            <h2 className="text-5xl font-black italic">1,250</h2>
            <button onClick={() => setShowStore(true)} className="mt-6 bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
               兑换精美奖品 <ArrowRight size={14} />
            </button>
          </div>
          <Trophy size={110} className="absolute -right-4 -bottom-4 opacity-20 rotate-12 group-hover:rotate-0 transition-transform" />
        </div>

        {/* Task List Header with restored "+" button and list style */}
        <div className="space-y-4 px-1">
          <div className="flex justify-between items-center px-1 mb-2">
            <h3 className="text-lg font-black text-slate-900 italic">护眼习惯任务</h3>
            <button 
              onClick={() => setShowAddTaskModal(true)}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-200 hover:rotate-90 transition-transform"
            >
              <Plus size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className={`bg-white p-6 rounded-[2.5rem] border border-slate-50 flex items-center justify-between shadow-sm transition-all ${task.status === 'completed' ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${task.status === 'completed' ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                    {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Activity size={24} />}
                  </div>
                  <div>
                    <p className={`font-black text-slate-900 text-sm ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-[10px] font-bold text-yellow-600 tracking-widest uppercase">+{task.points} 积分奖励</p>
                  </div>
                </div>
                {task.status !== 'completed' ? (
                  <button className="bg-slate-900 text-white text-[10px] font-black uppercase px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors">去督促</button>
                ) : (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-1">
                     <CheckCircle2 size={12} /> 已完成
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. 每周成就 Achievements Slider (Moved to Bottom) */}
        <div className="space-y-4 px-1 pt-8 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 italic">每周荣誉勋章</h3>
            <div className="flex gap-1.5">
               {ACHIEVEMENTS.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-yellow-500' : 'bg-slate-200'}`} />)}
            </div>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {ACHIEVEMENTS.map(ach => (
              <div key={ach.id} className={`flex-shrink-0 w-40 h-52 rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center transition-all relative ${ach.unlocked ? 'bg-white shadow-xl shadow-slate-100 border border-slate-50' : 'bg-slate-100 opacity-20 grayscale'}`}>
                <div className="text-5xl mb-4 drop-shadow-xl scale-110">{ach.icon}</div>
                <p className="text-[10px] font-black text-slate-900 uppercase leading-tight tracking-tight px-2">{ach.title}</p>
                <div className={`mt-4 text-[7px] font-black uppercase px-3 py-1 rounded-full ${ach.unlocked ? 'bg-yellow-400 text-yellow-950 shadow-md' : 'bg-slate-300 text-white'}`}>
                  {ach.unlocked ? '荣耀点亮' : '锁定中'}
                </div>
                {ach.unlocked && <Star size={12} className="absolute top-4 right-4 text-yellow-400 fill-current animate-pulse" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderManagement = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-10">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-4 z-10">
          <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/5"><Smartphone size={24} className="text-blue-400" /></div>
          <div>
            <h2 className="font-black text-lg tracking-tight">StarryEyes Pro</h2>
            <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">ID: {robotStatus.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 z-10 bg-white/10 px-5 py-2.5 rounded-2xl border border-white/10">
           <Battery size={22} className="text-emerald-400" />
           <span className="font-black text-2xl">{robotStatus.battery}%</span>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full"></div>
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50">
        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center justify-between">
           外观定制模组
           <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">实时 3D 渲染</span>
        </h3>
        <div className="p-10 bg-slate-50/50 rounded-[4rem] border border-slate-100 relative mb-10 overflow-hidden group shadow-inner">
           <RobotAvatar 
              skinId={robotStatus.currentSkin} 
              accessoryId={robotStatus.currentAccessory}
              backgroundId={robotStatus.currentBackground}
              expression="happy"
              size="lg"
           />
           <div className="absolute top-6 left-6 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-30"></div>
           <div className="absolute bottom-6 right-6 flex gap-2">
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
           </div>
        </div>

        {/* Modules Slider Selection */}
        <div className="space-y-12">
          {[
            { label: '模块 01 / 守护者皮肤', items: SKINS, key: 'currentSkin' },
            { label: '模块 02 / 个性化配饰', items: ACCESSORIES, key: 'currentAccessory' },
            { label: '模块 03 / 环境背景层', items: BACKGROUNDS, key: 'currentBackground' }
          ].map((mod, idx) => (
            <div key={idx}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1 flex justify-between">
                 {mod.label}
                 <ChevronRight size={14} className="text-slate-200" />
              </p>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
                {mod.items.map((item: any) => (
                  <button 
                    key={item.id}
                    onClick={() => setRobotStatus(prev => ({ ...prev, [mod.key]: item.id }))}
                    className={`flex-shrink-0 w-24 p-5 rounded-[2.5rem] border-2 transition-all duration-500 ${robotStatus[mod.key as keyof RobotConfig] === item.id ? 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100/40 scale-105 z-10' : 'border-slate-50 bg-white hover:border-slate-200 hover:scale-102'}`}
                  >
                    {item.color ? (
                      <div className={`w-10 h-10 rounded-2xl mb-3 mx-auto ${item.color} shadow-inner border border-white/40`} />
                    ) : (
                      <div className="text-3xl mb-3 text-center drop-shadow-md">{item.icon}</div>
                    )}
                    <p className="text-[10px] font-black text-center text-slate-900 truncate">{item.name}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Notification Settings */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
           <Bell size={20} className="text-blue-600" /> 守护通知深度管理
        </h3>
        <div className="space-y-8">
          {[
            { id: 'distance', label: '用眼距离提醒', desc: '离屏小于30cm时语音辅助' },
            { id: 'posture', label: '坐姿不良提醒', desc: '检测到侧弯或低头时即时反馈' },
            { id: 'break', label: '休息时间提醒', desc: '达45分钟强制锁屏进入深度休息' },
            { id: 'achievement', label: '成就解锁提醒', desc: '获得勋章或积分时家长侧推送' }
          ].map(notif => (
            <div key={notif.id} className="flex items-center justify-between group">
              <div className="max-w-[70%]">
                <p className="font-black text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{notif.label}</p>
                <p className="text-[10px] font-medium text-slate-400 leading-tight">{notif.desc}</p>
              </div>
              <button 
                onClick={() => setNotifications(prev => ({ ...prev, [notif.id]: !prev[notif.id as keyof typeof notifications] }))}
                className={`w-14 h-7 rounded-full relative transition-all duration-500 ${notifications[notif.id as keyof typeof notifications] ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${notifications[notif.id as keyof typeof notifications] ? 'left-8' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen pb-28 flex flex-col bg-[#F9FBFF] selection:bg-blue-100 overflow-x-hidden">
      {/* Header (Sticky) */}
      <header className="p-8 pb-4 flex items-center justify-between sticky top-0 bg-[#F9FBFF]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
           <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl ring-4 ring-slate-900/5"><ShieldCheck size={24} /></div>
           <div>
             <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">StarryEyes</h1>
             <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.25em]">Precision Guard</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="relative w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all hover:shadow-md">
              <Bell size={24} />
              <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white ring-4 ring-red-50"></div>
           </button>
           <div className="w-12 h-12 bg-white rounded-2xl p-0.5 shadow-xl border border-white overflow-hidden ring-2 ring-blue-50">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=StarryElite`} alt="User" className="w-full h-full rounded-xl" />
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 overflow-y-auto pt-4 no-scrollbar relative">
        {activeTab === Tab.HOME && renderHome()}
        {activeTab === Tab.DATA && renderData()}
        {activeTab === Tab.TASKS && renderTasks()}
        {activeTab === Tab.MANAGEMENT && renderManagement()}
      </main>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8 px-1">
                 <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic"><Plus className="text-blue-600" /> 新建护眼任务</h3>
                 <button onClick={() => setShowAddTaskModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors"><X size={28} /></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">任务名称</label>
                    <div className="relative">
                       <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         value={newTask.name}
                         onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                         className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold shadow-inner" 
                         placeholder="例如：远眺5分钟" 
                       />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">描述与说明</label>
                    <textarea 
                       value={newTask.desc}
                       onChange={(e) => setNewTask({...newTask, desc: e.target.value})}
                       className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-medium h-24 resize-none shadow-inner" 
                       placeholder="具体任务细节..." 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">目标值</label>
                       <div className="relative">
                          <Target size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            value={newTask.target}
                            onChange={(e) => setNewTask({...newTask, target: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold shadow-inner" 
                            placeholder="如：1次" 
                          />
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block px-1">积分奖励</label>
                       <div className="relative">
                          <Gift size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" />
                          <input 
                            value={newTask.reward}
                            onChange={(e) => setNewTask({...newTask, reward: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold shadow-inner" 
                            placeholder="如：20" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
              <button 
                onClick={handleAddTask}
                disabled={!newTask.name}
                className="w-full mt-10 bg-blue-600 text-white font-black py-5 rounded-[2.2rem] shadow-xl shadow-blue-100 disabled:opacity-50 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} /> 创建并即时同步
              </button>
           </div>
        </div>
      )}

      {/* Floating Assistant Widget */}
      <FloatingAssistant skinId={robotStatus.currentSkin} />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 max-w-md mx-auto h-20 bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] px-8 flex justify-between items-center z-[100] shadow-2xl shadow-slate-900/40 border border-white/10">
        <button 
          onClick={() => { setActiveTab(Tab.HOME); setShowStore(false); }}
          className={`group flex flex-col items-center gap-1.5 transition-all ${activeTab === Tab.HOME ? 'text-blue-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard size={26} className={`transition-all ${activeTab === Tab.HOME ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-widest">首页</span>
        </button>
        <button 
          onClick={() => { setActiveTab(Tab.DATA); setShowStore(false); }}
          className={`group flex flex-col items-center gap-1.5 transition-all ${activeTab === Tab.DATA ? 'text-blue-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        >
          <BarChart3 size={26} />
          <span className="text-[9px] font-black uppercase tracking-widest">数据</span>
        </button>
        <button 
          onClick={() => { setActiveTab(Tab.TASKS); setShowStore(false); }}
          className={`group flex flex-col items-center gap-1.5 transition-all ${activeTab === Tab.TASKS ? 'text-blue-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        >
          <Trophy size={26} />
          <span className="text-[9px] font-black uppercase tracking-widest">任务</span>
        </button>
        <button 
          onClick={() => { setActiveTab(Tab.MANAGEMENT); setShowStore(false); }}
          className={`group flex flex-col items-center gap-1.5 transition-all ${activeTab === Tab.MANAGEMENT ? 'text-blue-400 scale-110' : 'text-slate-400 hover:text-white'}`}
        >
          <Settings size={26} />
          <span className="text-[9px] font-black uppercase tracking-widest">设备</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
