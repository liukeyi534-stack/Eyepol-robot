
export interface EyeStatus {
  distance: number; // in cm
  posture: 'good' | 'leaning' | 'tilted';
  duration: number; // in minutes
  lastRest: string; // timestamp
}

export interface RobotConfig {
  id: string;
  battery: number;
  sensitivity: number;
  volume: number;
  currentSkin: string;
  currentAccessory: string;
  currentBackground: string;
  online: boolean;
}

export type TaskStatus = 'in-progress' | 'unfinished' | 'completed';

export interface RewardTask {
  id: string;
  title: string;
  points: number;
  status: TaskStatus;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  unlocked: boolean;
}

export enum Tab {
  HOME = 'home',
  DATA = 'data',
  TASKS = 'tasks',
  MANAGEMENT = 'management'
}
