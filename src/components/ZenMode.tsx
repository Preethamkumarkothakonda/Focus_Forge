import React from 'react';
import { motion } from 'framer-motion';
import { X, Maximize } from 'lucide-react';
import { Timer } from './Timer';
import { QuoteCarousel } from './QuoteCarousel';
import { TimerSettings } from '../types';

interface ZenModeProps {
  isZenMode: boolean;
  setIsZenMode: (value: boolean) => void;
  settings: TimerSettings;
  onPomodoroComplete: () => void;
}

export function ZenMode({ isZenMode, setIsZenMode, settings, onPomodoroComplete }: ZenModeProps) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!isZenMode) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8"
    >
      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center space-x-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <Maximize size={20} className="text-white" />
        </button>
        <button
          onClick={() => setIsZenMode(false)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
        >
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl w-full flex flex-col items-center space-y-12">
        <Timer settings={settings} onPomodoroComplete={onPomodoroComplete} />
        <div className="max-w-2xl w-full">
          <QuoteCarousel />
        </div>
      </div>
    </motion.div>
  );
}