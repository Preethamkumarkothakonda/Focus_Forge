import { useState, useEffect, useRef } from 'react';
import { TimerMode, TimerSettings } from '../types';

export function useTimer(settings: TimerSettings) {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getModeTime = (currentMode: TimerMode): number => {
    switch (currentMode) {
      case 'work':
        return settings.work * 60;
      case 'shortBreak':
        return settings.shortBreak * 60;
      case 'longBreak':
        return settings.longBreak * 60;
      default:
        return settings.work * 60;
    }
  };

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(getModeTime(mode));
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getModeTime(newMode));
    setIsActive(false);
  };

  const skip = () => {
    if (mode === 'work') {
      const nextMode = completedPomodoros > 0 && completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
      setCompletedPomodoros(prev => prev + 1);
      switchMode(nextMode);
    } else {
      switchMode('work');
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        setCompletedPomodoros(prev => prev + 1);
        const nextMode = completedPomodoros > 0 && completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
        switchMode(nextMode);
      } else {
        switchMode('work');
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, mode, completedPomodoros, settings]);

  useEffect(() => {
    setTimeLeft(getModeTime(mode));
  }, [settings, mode]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const totalTime = getModeTime(mode);
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return {
    mode,
    timeLeft,
    isActive,
    completedPomodoros,
    formatTime: formatTime(timeLeft),
    progress: getProgress(),
    start,
    pause,
    reset,
    skip,
    switchMode,
  };
}