export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface PomodoroStats {
  date: string;
  completed: number;
  workMinutes: number;
  breakMinutes: number;
}

export interface TimerSettings {
  work: number;
  shortBreak: number;
  longBreak: number;
}

export type TimerMode = 'work' | 'shortBreak' | 'longBreak';
export type Theme = 'dark' | 'focus';

export interface Quote {
  text: string;
  author: string;
}