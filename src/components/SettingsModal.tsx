import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings } from 'lucide-react';
import { TimerSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSave: (settings: TimerSettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Settings size={20} className="text-white" />
            <h2 className="text-xl font-bold text-white">Timer Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Work Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.work}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                work: parseInt(e.target.value) || 25
              })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Short Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={localSettings.shortBreak}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                shortBreak: parseInt(e.target.value) || 5
              })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Long Break Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={localSettings.longBreak}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                longBreak: parseInt(e.target.value) || 15
              })}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-xl text-white transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}