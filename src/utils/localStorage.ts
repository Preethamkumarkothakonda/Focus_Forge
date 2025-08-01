import { Task, PomodoroStats, TimerSettings, Theme } from '../types';

const STORAGE_KEYS = {
  TASKS: 'focusforge_tasks',
  POMODORO_STATS: 'focusforge_pomodoro_stats',
  TIMER_SETTINGS: 'focusforge_timer_settings',
  THEME: 'focusforge_theme',
  MUSIC_VOLUME: 'focusforge_music_volume',
  CURRENT_TRACK: 'focusforge_current_track',
};

export const storage = {
  // Tasks
  getTasks: (): Task[] => {
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return tasks ? JSON.parse(tasks) : [];
  },
  
  setTasks: (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },
  
  // Pomodoro Stats
  getPomodoroStats: (): PomodoroStats[] => {
    const stats = localStorage.getItem(STORAGE_KEYS.POMODORO_STATS);
    return stats ? JSON.parse(stats) : [];
  },
  
  setPomodoroStats: (stats: PomodoroStats[]) => {
    localStorage.setItem(STORAGE_KEYS.POMODORO_STATS, JSON.stringify(stats));
  },
  
  // Timer Settings
  getTimerSettings: (): TimerSettings => {
    const settings = localStorage.getItem(STORAGE_KEYS.TIMER_SETTINGS);
    return settings ? JSON.parse(settings) : { work: 25, shortBreak: 5, longBreak: 15 };
  },
  
  setTimerSettings: (settings: TimerSettings) => {
    localStorage.setItem(STORAGE_KEYS.TIMER_SETTINGS, JSON.stringify(settings));
  },
  
  // Theme
  getTheme: (): Theme => {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as Theme) === 'focus' ? 'focus' : 'dark';
  },
  
  setTheme: (theme: Theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  
  // Music
  getMusicVolume: (): number => {
    const volume = localStorage.getItem(STORAGE_KEYS.MUSIC_VOLUME);
    return volume ? parseFloat(volume) : 0.5;
  },
  
  setMusicVolume: (volume: number) => {
    localStorage.setItem(STORAGE_KEYS.MUSIC_VOLUME, volume.toString());
  },
  
  getCurrentTrack: (): string => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TRACK) || 'rain';
  },
  
  setCurrentTrack: (track: string) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TRACK, track);
  },
};