
import React from 'react';

export const COLORS = {
  primary: '#3B82F6', // Blue
  secondary: '#FBBF24', // Yellow
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bg: '#F8FAFC'
};

export const SKINS = [
  { id: 'classic', name: '经典白星', color: 'bg-white' },
  { id: 'space', name: '太空蓝', color: 'bg-blue-600' },
  { id: 'forest', name: '森林绿', color: 'bg-emerald-500' },
  { id: 'sunset', name: '晚霞粉', color: 'bg-pink-400' }
];

export const ACCESSORIES = [
  { id: 'none', name: '无', icon: '🚫' },
  { id: 'crown', name: '皇冠', icon: '👑' },
  { id: 'glasses', name: '酷墨镜', icon: '🕶️' },
  { id: 'ribbon', name: '蝴蝶结', icon: '🎀' }
];

export const BACKGROUNDS = [
  { id: 'default', name: '简约白', color: 'bg-gray-100' },
  { id: 'nebula', name: '星云紫', color: 'bg-indigo-900' },
  { id: 'grass', name: '青青草', color: 'bg-green-100' },
  { id: 'sunny', name: '暖阳黄', color: 'bg-yellow-50' }
];

export const ACHIEVEMENTS = [
  { id: 'streak-7', title: '连续打卡7天', icon: '🔥', unlocked: true },
  { id: 'dist-master', title: '距离达人', icon: '📏', unlocked: true },
  { id: 'break-champ', title: '休息冠军', icon: '☕', unlocked: false },
  { id: 'focus-king', title: '专注之王', icon: '👑', unlocked: false }
];

export const WEEKLY_MOCK = [
  { label: 'Mon', score: 85, studyTime: 120, avgDistance: 32, restCount: 3 },
  { label: 'Tue', score: 92, studyTime: 90, avgDistance: 35, restCount: 4 },
  { label: 'Wed', score: 78, studyTime: 150, avgDistance: 28, restCount: 2 },
  { label: 'Thu', score: 88, studyTime: 110, avgDistance: 33, restCount: 4 },
  { label: 'Fri', score: 95, studyTime: 100, avgDistance: 38, restCount: 5 },
  { label: 'Sat', score: 90, studyTime: 60, avgDistance: 35, restCount: 3 },
  { label: 'Sun', score: 94, studyTime: 45, avgDistance: 36, restCount: 2 },
];

export const DAILY_MOCK = [
  { label: '08:00', score: 90, studyTime: 0, avgDistance: 38, restCount: 0 },
  { label: '10:00', score: 85, studyTime: 40, avgDistance: 32, restCount: 1 },
  { label: '12:00', score: 80, studyTime: 20, avgDistance: 30, restCount: 1 },
  { label: '14:00', score: 92, studyTime: 50, avgDistance: 36, restCount: 2 },
  { label: '16:00', score: 88, studyTime: 30, avgDistance: 34, restCount: 1 },
  { label: '18:00', score: 95, studyTime: 15, avgDistance: 37, restCount: 1 },
  { label: '20:00', score: 93, studyTime: 10, avgDistance: 35, restCount: 0 },
];
