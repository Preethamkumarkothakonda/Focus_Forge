import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { useTimer } from '../hooks/useTimer';
import { TimerSettings } from '../types';
import { createNotificationSound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TimerProps {
  settings: TimerSettings;
  onPomodoroComplete: () => void;
}

export function Timer({ settings, onPomodoroComplete }: TimerProps) {
  const timer = useTimer(settings);

  useEffect(() => {
    if (timer.timeLeft === 0) {
      createNotificationSound();
      if (timer.mode === 'work') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onPomodoroComplete();
      }
    }
  }, [timer.timeLeft, timer.mode, onPomodoroComplete]);

  const getModeLabel = () => {
    switch (timer.mode) {
      case 'work':
        return 'Focus Time';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const getModeColor = () => {
    switch (timer.mode) {
      case 'work':
        return '#7F5AF0';
      case 'shortBreak':
        return '#2CB67D';
      case 'longBreak':
        return '#FF6B6B';
      default:
        return '#7F5AF0';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center space-y-6 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
    >
      {/* Mode Selector */}
      <div className="flex space-x-2">
        {(['work', 'shortBreak', 'longBreak'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => timer.switchMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              timer.mode === mode
                ? 'bg-white/20 text-white shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {mode === 'work' && 'Focus'}
            {mode === 'shortBreak' && 'Short Break'}
            {mode === 'longBreak' && 'Long Break'}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="3"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getModeColor()}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - timer.progress / 100)}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white mb-2">
            {timer.formatTime}
          </div>
          <div className="text-white/70 text-sm font-medium">
            {getModeLabel()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={timer.reset}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <RotateCcw size={20} className="text-white" />
        </button>
        
        <button
          onClick={timer.isActive ? timer.pause : timer.start}
          className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
        >
          {timer.isActive ? (
            <Pause size={24} className="text-white" />
          ) : (
            <Play size={24} className="text-white ml-1" />
          )}
        </button>
        
        <button
          onClick={timer.skip}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <SkipForward size={20} className="text-white" />
        </button>
      </div>

      {/* Stats */}
      <div className="text-center">
        <div className="text-2xl font-bold text-white">
          {timer.completedPomodoros}
        </div>
        <div className="text-white/70 text-sm">
          Pomodoros Completed
        </div>
      </div>
    </motion.div>
  );
}