import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Target, BarChart3, Music, Zap } from 'lucide-react';
import { Timer } from './components/Timer';
import { TodoList } from './components/TodoList';
import { FocusTracker } from './components/FocusTracker';
import { QuoteCarousel } from './components/QuoteCarousel';
import { MusicPlayer } from './components/MusicPlayer';
import { ThemeToggle } from './components/ThemeToggle';
import { ZenMode } from './components/ZenMode';
import { SettingsModal } from './components/SettingsModal';
import { Task, PomodoroStats, TimerSettings, Theme } from './types';
import { storage } from './utils/localStorage';

function App() {
  const [theme, setTheme] = useState<Theme>(() => storage.getTheme());
  const [tasks, setTasks] = useState<Task[]>(() => storage.getTasks());
  const [pomodoroStats, setPomodoroStats] = useState<PomodoroStats[]>(() => storage.getPomodoroStats());
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() => storage.getTimerSettings());
  const [isZenMode, setIsZenMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    storage.setTheme(theme);
    document.documentElement.className = theme;
  }, [theme]);

  const handlePomodoroComplete = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayStats = pomodoroStats.find(stat => stat.date === today);
    
    if (todayStats) {
      const updatedStats = pomodoroStats.map(stat =>
        stat.date === today
          ? { ...stat, completed: stat.completed + 1, workMinutes: stat.workMinutes + timerSettings.work }
          : stat
      );
      setPomodoroStats(updatedStats);
      storage.setPomodoroStats(updatedStats);
    } else {
      const newStats = [...pomodoroStats, {
        date: today,
        completed: 1,
        workMinutes: timerSettings.work,
        breakMinutes: 0,
      }];
      setPomodoroStats(newStats);
      storage.setPomodoroStats(newStats);
    }
  };

  const handleSettingsSave = (settings: TimerSettings) => {
    setTimerSettings(settings);
    storage.setTimerSettings(settings);
  };

  const getBackgroundClass = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900';
      case 'focus':
        return 'bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-gradient-x';
      default:
        return 'bg-gray-900';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${getBackgroundClass()}`}>
      <AnimatePresence>
        {isZenMode && (
          <ZenMode
            isZenMode={isZenMode}
            setIsZenMode={setIsZenMode}
            settings={timerSettings}
            onPomodoroComplete={handlePomodoroComplete}
          />
        )}
      </AnimatePresence>

      {!isZenMode && (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Target size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">FocusForge</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsZenMode(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors duration-200"
              >
                <Zap size={16} className="text-white" />
                <span className="text-white text-sm font-medium">Zen Mode</span>
              </button>
              
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <Settings size={20} className="text-white" />
              </button>
              
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </motion.header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Timer and Quote */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Timer
                  settings={timerSettings}
                  onPomodoroComplete={handlePomodoroComplete}
                />
                <QuoteCarousel />
              </div>

              {/* Focus Tracker */}
              <FocusTracker stats={pomodoroStats} />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Todo List */}
              <TodoList tasks={tasks} setTasks={setTasks} />
              
              {/* Music Player */}
              <MusicPlayer />
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={timerSettings}
            onSave={handleSettingsSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;